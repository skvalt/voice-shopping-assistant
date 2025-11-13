package com.vsa.controller;

import com.vsa.model.dto.UpdateItemRequest;
import com.vsa.model.response.ParsedIntentResponse;
import com.vsa.service.NlpService;
import com.vsa.service.SuggestionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Voice endpoints. The frontend will send recognized text (speech->text).
 * We parse intent and act accordingly.
 */
@RestController
@RequestMapping("/api/voice")
public class VoiceController {

    private final NlpService nlpService;
    private final SuggestionService suggestionService;

    public VoiceController(NlpService nlpService, SuggestionService suggestionService) {
        this.nlpService = nlpService;
        this.suggestionService = suggestionService;
    }

    /**
     * Endpoint receives recognized text (from frontend speech recognition)
     * and returns parsed intent + possible action preview.
     */
    @PostMapping("/parse")
    public ResponseEntity<ParsedIntentResponse> parseVoice(@RequestBody String text) {
        var parsed = nlpService.parse(text);
        return ResponseEntity.ok(parsed);
    }

    /**
     * Optionally allow frontend to trigger an add/update using normalized DTO from parsed intent.
     */
    @PostMapping("/apply")
    public ResponseEntity<?> applyIntent(@RequestBody UpdateItemRequest req) {
        // Here you would call your ItemService to add/update list; stubbed as success
        // For now return parsed suggestion for preview
        return ResponseEntity.ok().build();
    }
}
