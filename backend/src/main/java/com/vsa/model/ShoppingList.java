package com.vsa.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "shopping_lists")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShoppingList {

    @Id
    private String id;

    // owner user id
    private String userId;

    private String name;

    // store only item IDs
    private List<String> itemIds = new ArrayList<>();

    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();
}
