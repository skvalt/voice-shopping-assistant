package com.vsa.repository;

import com.vsa.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends MongoRepository<Product, String> {
    List<Product> findByCategoryIgnoreCase(String category);
    Optional<Product> findByNameIgnoreCase(String name);
    List<Product> findTop10ByOrderByPopularityDesc();
    List<Product> findByPriceBetween(java.math.BigDecimal min, java.math.BigDecimal max);
}
