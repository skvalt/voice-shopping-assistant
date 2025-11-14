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

    @PostMapping
    public ResponseEntity<Item> createItem(@Valid @RequestBody AddItemRequest req,
                                           Authentication authentication) {

        Optional<String> username = Optional.ofNullable(authentication)
                .map(Authentication::getName);

        Item saved = itemService.addItem(req, username);
        return ResponseEntity.status(201).body(saved);
    }

    @GetMapping
    public ResponseEntity<List<Item>> listItems(@RequestParam(required = false) String userId,
                                                Authentication authentication) {

        Optional<String> username = Optional.ofNullable(authentication)
                .map(Authentication::getName);

        List<Item> items = itemService.getItemsForUser(userId);
        return ResponseEntity.ok(items);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Item> updateItem(@PathVariable String id,
                                           @Valid @RequestBody AddItemRequest req,
                                           Authentication authentication) {

        Optional<String> username = Optional.ofNullable(authentication)
                .map(Authentication::getName);

        Item updated = itemService.updateItem(id, req, username);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
public ResponseEntity<Void> deleteItem(@PathVariable String id,
                                       Authentication authentication) {
    // keep your naming convention
    Optional<String> username = Optional.ofNullable(authentication).map(Authentication::getName);

    // quick debug log so you can see who's calling and what id
    System.out.println("DELETE request by username=" + username.orElse("ANONYMOUS") + " for itemId=" + id);

    try {
        itemService.deleteItem(id, username);
        return ResponseEntity.noContent().build();
    } catch (IllegalArgumentException ex) {
        // ownership or auth check failed in service
        System.out.println("DELETE forbidden: " + ex.getMessage());
        return ResponseEntity.status(403).build();
    } catch (com.vsa.exceptions.ItemNotFoundException ex) {
        return ResponseEntity.notFound().build();
    } catch (Exception ex) {
        // unexpected error, log it and return 500
        ex.printStackTrace();
        return ResponseEntity.status(500).build();
    }
}


    @PostMapping("/{id}/check")
    public ResponseEntity<Item> checkItem(@PathVariable String id,
                                          @RequestParam boolean checked,
                                          Authentication authentication) {

        Optional<String> username = Optional.ofNullable(authentication)
                .map(Authentication::getName);

        Item updated = itemService.toggleCheck(id, checked, username);
        return ResponseEntity.ok(updated);
    }
}
