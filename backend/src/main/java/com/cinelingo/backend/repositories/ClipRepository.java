package com.cinelingo.backend.repositories;

import com.cinelingo.backend.models.Clip;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ClipRepository extends MongoRepository<Clip, String> {
    // findByLanguage removed — Clip model has no language field
    List<Clip> findByDifficultyLevelBetween(int min, int max);
    List<Clip> findByGenreContaining(String genre);
    List<Clip> findByMovieName(String movieName);
}