package com.vsa.service;

import com.vsa.exceptions.ItemNotFoundException;
import com.vsa.model.Item;
import com.vsa.model.dto.AddItemRequest;
import com.vsa.repository.ItemRepository;
import com.vsa.repository.UserRepository;
import com.vsa.model.User;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class ItemService {

    private final ItemRepository itemRepository;
    private final UserRepository userRepository;

    public ItemService(ItemRepository itemRepository, UserRepository userRepository) {
        this.itemRepository = itemRepository;
        this.userRepository = userRepository;
    }

    public Item addItem(AddItemRequest req, Optional<String> authUsername) {
        String userId = req.getUserId();

        // if caller is authenticated, prefer authenticated user (resolve from username)
        if (authUsername.isPresent()) {
            User u = userRepository.findByUsername(authUsername.get()).orElse(null);
            if (u != null) {
                userId = u.getId();
            }
        }

        Item item = Item.builder()
                .userId(userId)
                .name(req.getName().trim())
                .quantity(Math.max(1, req.getQuantity()))
                .unit(req.getUnit())
                .category(req.getCategory())
                .price(req.getPrice())
                .checked(false)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        return itemRepository.save(item);
    }

    public List<Item> getItemsForUser(String userId) {
        if (userId == null) {
            return itemRepository.findAll();
        }
        return itemRepository.findByUserId(userId);
    }

    public Item updateItem(String id, AddItemRequest req, Optional<String> authUsername) {
        Item existing = itemRepository.findById(id).orElseThrow(() -> new ItemNotFoundException(id));

        // ensure ownership if authenticated user exists
        if (authUsername.isPresent()) {
            User u = userRepository.findByUsername(authUsername.get()).orElse(null);
            if (u != null && existing.getUserId() != null && !existing.getUserId().equals(u.getId())) {
                throw new IllegalArgumentException("Not authorized to modify this item");
            }
        }

        if (req.getName() != null && !req.getName().isBlank()) existing.setName(req.getName().trim());
        if (req.getQuantity() > 0) existing.setQuantity(req.getQuantity());
        if (req.getUnit() != null) existing.setUnit(req.getUnit());
        if (req.getCategory() != null) existing.setCategory(req.getCategory());
        if (req.getPrice() != null) existing.setPrice(req.getPrice());

        existing.setUpdatedAt(Instant.now());
        return itemRepository.save(existing);
    }

    public void deleteItem(String id, Optional<String> authUsername) {
        Item existing = itemRepository.findById(id).orElseThrow(() -> new ItemNotFoundException(id));
        if (authUsername.isPresent()) {
            User u = userRepository.findByUsername(authUsername.get()).orElse(null);
            if (u != null && existing.getUserId() != null && !existing.getUserId().equals(u.getId())) {
                throw new IllegalArgumentException("Not authorized to delete this item");
            }
        }
        itemRepository.deleteById(id);
    }

    public Item toggleCheck(String id, boolean checked, Optional<String> authUsername) {
        Item existing = itemRepository.findById(id).orElseThrow(() -> new ItemNotFoundException(id));
        if (authUsername.isPresent()) {
            User u = userRepository.findByUsername(authUsername.get()).orElse(null);
            if (u != null && existing.getUserId() != null && !existing.getUserId().equals(u.getId())) {
                throw new IllegalArgumentException("Not authorized to modify this item");
            }
        }
        existing.setChecked(checked);
        existing.setUpdatedAt(Instant.now());
        return itemRepository.save(existing);
    }
}
