package com.cinelingo.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PronunciationRequest {
    private String text;
    private String expectedPhrase;
    private String userId;
    private byte[] audioData; // Optional: base64 encoded audio
    private String language;  // Default: "ko-KR"
}