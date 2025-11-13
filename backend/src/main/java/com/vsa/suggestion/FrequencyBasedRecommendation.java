package com.vsa.suggestion;

import com.vsa.model.Product;
import com.vsa.repository.ProductRepository;

import java.util.List;

public class FrequencyBasedRecommendation implements RecommendationStrategy {

    private final ProductRepository repo;

    public FrequencyBasedRecommendation(ProductRepository repo) {
        this.repo = repo;
    }

    @Override
    public List<Product> recommend(String category) {
        // ignore category; return top popular
        return repo.findTop10ByOrderByPopularityDesc();
    }
}
