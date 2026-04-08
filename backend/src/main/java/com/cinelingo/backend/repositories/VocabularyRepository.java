package com.cinelingo.backend.repositories;

import com.cinelingo.backend.models.Vocabulary;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface VocabularyRepository extends MongoRepository<Vocabulary, String> {
    Optional<Vocabulary> findByWordAndLanguage(String word, String language);
    List<Vocabulary> findByLanguage(String language);
    List<Vocabulary> findByDifficultyLevelBetween(int min, int max);
    List<Vocabulary> findByClipIdsContaining(String clipId);
}