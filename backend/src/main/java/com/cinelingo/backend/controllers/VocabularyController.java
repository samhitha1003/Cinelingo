package com.cinelingo.backend.controllers;

import com.cinelingo.backend.models.Vocabulary;
import com.cinelingo.backend.services.VocabularyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vocabulary")
@CrossOrigin(origins = "*")
public class VocabularyController {

    private final VocabularyService vocabularyService;

    public VocabularyController(VocabularyService vocabularyService) {
        this.vocabularyService = vocabularyService;
    }

    // Get all vocabulary
    @GetMapping
    public ResponseEntity<?> getAllVocabulary() {
        try {
            List<Vocabulary> vocab = vocabularyService.getAllVocabulary();
            return ResponseEntity.ok(vocab);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }

    // Get vocabulary by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        try {
            Vocabulary vocab = vocabularyService.getById(id);
            return ResponseEntity.ok(vocab);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }

    // Get vocabulary by word
    @GetMapping("/word/{word}")
    public ResponseEntity<?> getByWord(
            @PathVariable String word,
            @RequestParam(defaultValue = "korean") String language) {
        try {
            Vocabulary vocab = vocabularyService.getByWord(word, language);
            return ResponseEntity.ok(vocab);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }

    // Get vocabulary for a specific clip
    @GetMapping("/clip/{clipId}")
    public ResponseEntity<?> getVocabForClip(@PathVariable String clipId) {
        try {
            List<Vocabulary> vocab = vocabularyService.getVocabularyForClip(clipId);
            return ResponseEntity.ok(vocab);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }

    // Get vocabulary by difficulty
    @GetMapping("/difficulty/{min}/{max}")
    public ResponseEntity<?> getByDifficulty(
            @PathVariable int min,
            @PathVariable int max) {
        try {
            List<Vocabulary> vocab = vocabularyService.getByDifficulty(min, max);
            return ResponseEntity.ok(vocab);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }

    // Add new vocabulary
    @PostMapping
    public ResponseEntity<?> addVocabulary(@RequestBody Vocabulary vocabulary) {
        try {
            Vocabulary saved = vocabularyService.addVocabulary(vocabulary);
            return ResponseEntity.ok(Map.of(
                    "message", "Vocabulary added successfully!",
                    "vocabularyId", saved.getId()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }

    // Add Korean word quickly
    @PostMapping("/korean/quick")
    public ResponseEntity<?> addKoreanWord(@RequestBody Map<String, String> request) {
        try {
            Vocabulary vocab = vocabularyService.addKoreanWord(
                    request.get("word"),
                    request.get("phonetic"),
                    request.get("meaning"),
                    request.get("exampleSentence"),
                    request.get("clipId"),
                    Integer.parseInt(request.getOrDefault("difficultyLevel", "1"))
            );
            return ResponseEntity.ok(Map.of(
                    "message", "Korean word added!",
                    "vocabularyId", vocab.getId(),
                    "word", vocab.getWord()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }

    // Delete vocabulary
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVocabulary(@PathVariable String id) {
        try {
            vocabularyService.deleteVocabulary(id);
            return ResponseEntity.ok(Map.of(
                    "message", "Vocabulary deleted!"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }
}
