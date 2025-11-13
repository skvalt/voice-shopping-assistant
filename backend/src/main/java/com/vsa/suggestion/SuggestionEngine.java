package com.vsa.suggestion;

import com.vsa.model.Product;
import com.vsa.model.response.ParsedIntentResponse;

import java.util.Collections;
import java.util.List;

/**
 * Orchestrates multiple suggestion strategies.
 */
public class SuggestionEngine {

    private final RecommendationStrategy categoryStrat;
    private final RecommendationStrategy freqStrat;

    public SuggestionEngine(RecommendationStrategy categoryStrat, RecommendationStrategy freqStrat) {
        this.categoryStrat = categoryStrat;
        this.freqStrat = freqStrat;
    }

    // simple substitute: find same category, different brand (placeholder)
    public List<Product> suggestSubstitutes(ParsedIntentResponse parsed) {
        var entities = parsed.getEntities();
        if (entities == null || !entities.containsKey("product")) return Collections.emptyList();

        String product = entities.get("product");
        // placeholder: return frequency-based for now
        return freqStrat.recommend(null);
    }
}
