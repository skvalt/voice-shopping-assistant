package com.vsa.nlp;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Extracts entities like product name, quantity, category from text.
 * This is intentionally simple rule-based logic for now.
 */
public class EntityExtractor {

    private static final Pattern QTY_PATTERN =
            Pattern.compile("(\\d+)\\s*(bottles|pieces|pcs|packs|kg|g|liters|l)?",
                    Pattern.CASE_INSENSITIVE);

    private static final Pattern PRODUCT_PATTERN =
            Pattern.compile("(add|buy|need|get|order|bring)\\s+([a-zA-Z0-9\\s]+)",
                    Pattern.CASE_INSENSITIVE);

    public Map<String, String> extract(String text) {
        Map<String, String> map = new HashMap<>();

        Matcher qtyMatcher = QTY_PATTERN.matcher(text);
        if (qtyMatcher.find()) {
            map.put("quantity", qtyMatcher.group(1));
        }

        Matcher productMatcher = PRODUCT_PATTERN.matcher(text);
        if (productMatcher.find()) {
            map.put("product", productMatcher.group(2).trim());
        } else {
            // fallback: last word heuristic
            String[] tokens = text.split("\\s+");
            if (tokens.length > 0) {
                String guess = tokens[tokens.length - 1].replaceAll("[^a-zA-Z0-9 ]", "");
                map.put("product", guess.trim());
            }
        }

        return map;
    }
}
