package com.cinelingo.backend.controllers;

import com.cinelingo.backend.models.Clip;
import com.cinelingo.backend.services.ClipService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/clips")
@CrossOrigin(origins = "*")
public class ClipController {

    private final ClipService clipService;

    public ClipController(ClipService clipService) {
        this.clipService = clipService;
    }

    // Get all clips
    @GetMapping
    public ResponseEntity<?> getAllClips() {
        try {
            List<Clip> clips = clipService.getAllClips();
            return ResponseEntity.ok(clips);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }

    // Get clip by ID
    @GetMapping("/{clipId}")
    public ResponseEntity<?> getClipById(@PathVariable String clipId) {
        try {
            Clip clip = clipService.getClipById(clipId);
            return ResponseEntity.ok(clip);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }

    // Get clips by difficulty
    @GetMapping("/difficulty/{min}/{max}")
    public ResponseEntity<?> getByDifficulty(
            @PathVariable int min,
            @PathVariable int max) {
        try {
            List<Clip> clips = clipService.getClipsByDifficulty(min, max);
            return ResponseEntity.ok(clips);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }

    // Get clips by genre
    @GetMapping("/genre/{genre}")
    public ResponseEntity<?> getByGenre(@PathVariable String genre) {
        try {
            List<Clip> clips = clipService.getClipsByGenre(genre);
            return ResponseEntity.ok(clips);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }

    // Get clips by movie name
    @GetMapping("/movie/{movieName}")
    public ResponseEntity<?> getByMovie(@PathVariable String movieName) {
        try {
            List<Clip> clips = clipService.getClipsByMovie(movieName);
            return ResponseEntity.ok(clips);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }

    // Add new clip
    @PostMapping
    public ResponseEntity<?> addClip(@RequestBody Clip clip) {
        try {
            Clip saved = clipService.addClip(clip);
            return ResponseEntity.ok(Map.of(
                    "message", "Clip added successfully!",
                    "clipId", saved.getId()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }

    // Increment view count
    @PutMapping("/{clipId}/view")
    public ResponseEntity<?> incrementView(@PathVariable String clipId) {
        try {
            Clip clip = clipService.incrementViewCount(clipId);
            return ResponseEntity.ok(Map.of(
                    "message", "View count updated!",
                    "viewCount", clip.getViewCount()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }

    // Rate a clip
    @PostMapping("/{clipId}/rate")
    public ResponseEntity<?> rateClip(
            @PathVariable String clipId,
            @RequestBody Map<String, Double> request) {
        try {
            Clip clip = clipService.updateRating(clipId, request.get("rating"));
            return ResponseEntity.ok(Map.of(
                    "message", "Rating updated!",
                    "newRating", clip.getAverageRating()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }

    // Delete clip
    @DeleteMapping("/{clipId}")
    public ResponseEntity<?> deleteClip(@PathVariable String clipId) {
        try {
            clipService.deleteClip(clipId);
            return ResponseEntity.ok(Map.of(
                    "message", "Clip deleted!"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }
}