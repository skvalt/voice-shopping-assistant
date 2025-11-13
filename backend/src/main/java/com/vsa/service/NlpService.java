package com.vsa.service;

import com.vsa.model.response.ParsedIntentResponse;
import com.vsa.nlp.ParserEngine;
import org.springframework.stereotype.Service;

/**
 * Thin service wrapping parser engine for injection.
 */
@Service
public class NlpService {
    private final ParserEngine engine = new ParserEngine();

    public ParsedIntentResponse parse(String text) {
        return engine.parse(text);
    }
}
