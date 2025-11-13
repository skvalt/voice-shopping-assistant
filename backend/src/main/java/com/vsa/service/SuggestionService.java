package com.vsa.service;

import com.vsa.model.Product;
import com.vsa.model.response.ParsedIntentResponse;
import com.vsa.repository.ProductRepository;
import com.vsa.suggestion.SuggestionEngine;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SuggestionService {

    private final ProductRepository productRepository;
    private final SuggestionEngine engine;

    public SuggestionService(ProductRepository productRepository, SuggestionEngine engine) {
        this.productRepository = productRepository;
        this.engine = engine;
    }

    public List<Product> suggest(String userId) {
        // baseline: return top popular products (frequency)
        return productRepository.findTop10ByOrderByPopularityDesc();
    }

    public List<Product> suggestByCategory(String category) {
        return productRepository.findByCategoryIgnoreCase(category);
    }

    public List<Product> suggestSubstitutes(ParsedIntentResponse parsed) {
        // engine chooses substitute strategy
        return engine.suggestSubstitutes(parsed);
    }
}
