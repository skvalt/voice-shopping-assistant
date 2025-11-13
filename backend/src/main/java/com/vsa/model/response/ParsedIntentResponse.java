package com.vsa.model.response;

import lombok.*;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParsedIntentResponse {
    private String intent;
    private Map<String, String> entities;
}
