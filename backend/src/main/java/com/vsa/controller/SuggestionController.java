package com.vsa.controller;

import com.vsa.model.Product;
import com.vsa.model.response.ParsedIntentResponse;
import com.vsa.service.SuggestionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Endpoints for suggestions (recommendations).
 */
@RestController
@RequestMapping("/api/suggestions")
public class SuggestionController {

    private final SuggestionService suggestionService;

    public SuggestionController(SuggestionService suggestionService) {
        this.suggestionService = suggestionService;
    }

    // Get generic suggestions for a user (userId optional) - returns list of products
    @GetMapping
    public ResponseEntity<List<Product>> getSuggestions(@RequestParam(required = false) String userId) {
        return ResponseEntity.ok(suggestionService.suggest(userId));
    }

    // Get category-specific suggestions
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Product>> suggestionsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(suggestionService.suggestByCategory(category));
    }

    // For testing: accept a parsed intent and return suggested substitutes
    @PostMapping("/substitutes")
    public ResponseEntity<List<Product>> substitutes(@RequestBody ParsedIntentResponse parsed) {
        return ResponseEntity.ok(suggestionService.suggestSubstitutes(parsed));
    }
}
