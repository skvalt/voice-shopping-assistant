package com.vsa.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Item {

    @Id
    private String id;

    /**
     * owner user id (from users collection). Nullable for guest/demo usage.
     */
    private String userId;

    /**
     * human friendly name, e.g. "Milk"
     */
    private String name;

    /**
     * numeric quantity (1,2,3) - keep as int for simplicity
     */
    private int quantity = 1;

    /**
     * unit (pcs, kg, l). Optional.
     */
    private String unit;

    /**
     * category (Dairy, Produce, Bakery...)
     */
    private String category;

    /**
     * price per unit if available
     */
    private Double price;

    /**
     * whether the item is checked/completed in the shopping list
     */
    private boolean checked = false;

    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();
}
