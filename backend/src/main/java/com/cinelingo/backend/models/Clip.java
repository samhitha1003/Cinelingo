package com.cinelingo.backend.models;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "clips")
public class Clip {

    @Id
    private String id;

    private String title;
    private String movieName;
    private String description;

    // ── Video source ──────────────────────────────────────────────────────────
    private String youtubeId;       // ← NEW: YouTube video ID e.g. "Q-rGIR3DdNk"
    private int youtubeStart;       // ← NEW: Start time in seconds
    private String videoUrl;        // kept for backwards compatibility
    private String thumbnailUrl;

    // ── Metadata ──────────────────────────────────────────────────────────────
    private int difficultyLevel;    // 1-5
    private String accentType;      // Seoul / Busan / Pyongyang
    private List<String> genre;
    private List<String> grammarFocus;

    // ── Stats ─────────────────────────────────────────────────────────────────
    private int viewCount;
    private double averageRating;
    private LocalDateTime createdAt;
}