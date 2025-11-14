package com.vsa.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    private String id;

    private String name;
    private String category;
    private String brand;           // optional but helps NLP
    private String unit;            // e.g. "1L", "500g"
    private Double price;

    private List<String> tags;      // synonyms, alternate names
}
