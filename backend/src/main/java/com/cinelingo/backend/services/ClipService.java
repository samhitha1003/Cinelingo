package com.cinelingo.backend.services;

import com.cinelingo.backend.models.Clip;
import com.cinelingo.backend.repositories.ClipRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ClipService {

    private final ClipRepository clipRepository;

    public ClipService(ClipRepository clipRepository) {
        this.clipRepository = clipRepository;
    }

    public List<Clip> getAllClips() {
        return clipRepository.findAll();
    }

    public Clip getClipById(String clipId) {
        return clipRepository.findById(clipId)
                .orElseThrow(() -> new RuntimeException("Clip not found!"));
    }

    public List<Clip> getClipsByDifficulty(int min, int max) {
        return clipRepository.findByDifficultyLevelBetween(min, max);
    }

    public List<Clip> getClipsByGenre(String genre) {
        return clipRepository.findByGenreContaining(genre);
    }

    public List<Clip> getClipsByMovie(String movieName) {
        return clipRepository.findByMovieName(movieName);
    }

    public Clip addClip(Clip clip) {
        clip.setCreatedAt(LocalDateTime.now());
        clip.setViewCount(0);
        clip.setAverageRating(0.0);
        return clipRepository.save(clip);
    }

    public Clip incrementViewCount(String clipId) {
        Clip clip = getClipById(clipId);
        clip.setViewCount(clip.getViewCount() + 1);
        return clipRepository.save(clip);
    }

    public Clip updateRating(String clipId, double newRating) {
        Clip clip = getClipById(clipId);
        double currentRating = clip.getAverageRating();
        int viewCount = clip.getViewCount();
        double updatedRating = ((currentRating * viewCount) + newRating) / (viewCount + 1);
        clip.setAverageRating(updatedRating);
        return clipRepository.save(clip);
    }

    // getClipsByLanguage removed — Clip model has no language field

    public void deleteClip(String clipId) {
        clipRepository.deleteById(clipId);
    }
}