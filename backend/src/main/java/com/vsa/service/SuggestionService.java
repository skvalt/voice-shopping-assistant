package com.vsa.service;

import com.vsa.model.Product;
import com.vsa.model.Item;
import com.vsa.model.response.ParsedIntentResponse;
import com.vsa.repository.ProductRepository;
import com.vsa.repository.ItemRepository;
import com.vsa.suggestion.SuggestionEngine;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * High-level service used by SuggestionController.
 * Delegates to repository + suggestion engine strategies.
 */
@Service
public class SuggestionService {

    private final ProductRepository productRepository;
    private final ItemRepository itemRepository;
    private final SuggestionEngine suggestionEngine;

    public SuggestionService(ProductRepository productRepository,
                             ItemRepository itemRepository,
                             SuggestionEngine suggestionEngine) {
        this.productRepository = productRepository;
        this.itemRepository = itemRepository;
        this.suggestionEngine = suggestionEngine;
    }

    /**
     * Generic suggestions. If userId provided, use user's history frequency.
     * If no userId, use frequency-based global suggestions.
     */
    public List<Product> suggest(String userId) {
        // if user has history, recommend top items from their history
        if (userId != null && !userId.isBlank()) {
            Map<String, Long> counts = itemRepository.findAll().stream()
                    .filter(i -> userId.equals(i.getUserId()))
                    .collect(Collectors.groupingBy(i -> i.getName().toLowerCase().trim(), Collectors.counting()));

            if (!counts.isEmpty()) {
                List<String> topNames = counts.entrySet().stream()
                        .sorted((a, b) -> Long.compare(b.getValue(), a.getValue()))
                        .limit(10)
                        .map(Map.Entry::getKey)
                        .collect(Collectors.toList());

                List<Product> results = new ArrayList<>();
                for (String nm : topNames) {
                    results.addAll(productRepository.findByNameRegex("(?i).*" + Pattern.quote(nm) + ".*"));
                }
                // dedupe and return
                LinkedHashMap<String, Product> dedup = new LinkedHashMap<>();
                for (Product p : results) dedup.putIfAbsent(p.getId(), p);
                return new ArrayList<>(dedup.values());
            }
        }

        // fallback: use engine's frequency strategy (freqStrategy.recommend(null))
        return suggestionEngine != null ? suggestionEngine.suggestSubstitutes(null) /* placeholder */ : Collections.emptyList();
    }

    /**
     * Category-specific suggestions
     */
    public List<Product> suggestByCategory(String category) {
        if (category == null || category.isBlank()) return Collections.emptyList();
        return productRepository.findByCategoryIgnoreCase(category);
    }

    /**
     * Given a parsed intent, return substitutes using SuggestionEngine.
     */
    public List<Product> suggestSubstitutes(ParsedIntentResponse parsed) {
        if (parsed == null) return Collections.emptyList();
        return suggestionEngine.suggestSubstitutes(parsed);
    }
}
