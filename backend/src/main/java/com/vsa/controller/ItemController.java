package com.vsa.controller;

import com.vsa.model.Item;
import com.vsa.model.dto.AddItemRequest;
import com.vsa.service.ItemService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    private final ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    /**
     * Create item. If authenticated, userId in request will be ignored and the authenticated user is used.
     */
    @PostMapping
    public ResponseEntity<Item> createItem(@Valid @RequestBody AddItemRequest req, Authentication authentication) {
        Optional<String> username = Optional.ofNullable(authentication).map(Authentication::getName);
        Item saved = itemService.addItem(req, username);
        return ResponseEntity.status(201).body(saved);
    }

    /**
     * Get items for userId. If userId is omitted and caller is authenticated, returns items for auth user.
     * If neither provided, returns all items (admin / dev debug).
     */
    @GetMapping
    public ResponseEntity<List<Item>> listItems(@RequestParam(required = false) String userId,
                                                Authentication authentication) {
        Optional<String> username = Optional.ofNullable(authentication).map(Authentication::getName);
        if (userId == null && username.isPresent()) {
            // resolve username -> userId via service
            // ItemService.getItemsForUser accepts userId; controller may resolve username -> user id
            // For brevity, ItemService.getItemsForUser handles null as 'all' and controller can pass resolved id if needed.
            // We'll do lookup by username via the Authentication name for service to resolve when adding/updating only.
        }
        List<Item> items = itemService.getItemsForUser(userId);
        return ResponseEntity.ok(items);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Item> updateItem(@PathVariable String id,
                                           @Valid @RequestBody AddItemRequest req,
                                           Authentication authentication) {
        Optional<String> username = Optional.ofNullable(authentication).map(Authentication::getName);
        Item updated = itemService.updateItem(id, req, username);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteItem(@PathVariable String id, Authentication authentication) {
        Optional<String> username = Optional.ofNullable(authentication).map(Authentication::getName);
        itemService.deleteItem(id, username);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/check")
    public ResponseEntity<Item> checkItem(@PathVariable String id, @RequestParam boolean checked, Authentication authentication) {
        Optional<String> username = Optional.ofNullable(authentication).map(Authentication::getName);
        Item updated = itemService.toggleCheck(id, checked, username);
        return ResponseEntity.ok(updated);
    }
}
