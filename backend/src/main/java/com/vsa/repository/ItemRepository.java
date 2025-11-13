package com.vsa.repository;

import com.vsa.model.Item;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ItemRepository extends MongoRepository<Item, String> {
    List<Item> findByUserId(String userId);
    List<Item> findByUserIdAndCategory(String userId, String category);
}
