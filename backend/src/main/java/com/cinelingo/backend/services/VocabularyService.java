package com.cinelingo.backend.services;

import com.cinelingo.backend.models.Vocabulary;
import com.cinelingo.backend.repositories.VocabularyRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class VocabularyService {

    private final VocabularyRepository vocabularyRepository;

    public VocabularyService(VocabularyRepository vocabularyRepository) {
        this.vocabularyRepository = vocabularyRepository;
    }

    // Get all vocabulary
    public List<Vocabulary> getAllVocabulary() {
        return vocabularyRepository.findAll();
    }

    // Get vocabulary by ID
    public Vocabulary getById(String id) {
        return vocabularyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vocabulary not found!"));
    }

    // Get vocabulary by word
    public Vocabulary getByWord(String word, String language) {
        return vocabularyRepository.findByWordAndLanguage(word, language)
                .orElseThrow(() -> new RuntimeException("Word not found!"));
    }

    // Get vocabulary for a clip
    public List<Vocabulary> getVocabularyForClip(String clipId) {
        return vocabularyRepository.findByClipIdsContaining(clipId);
    }

    // Get vocabulary by difficulty
    public List<Vocabulary> getByDifficulty(int min, int max) {
        return vocabularyRepository.findByDifficultyLevelBetween(min, max);
    }

    // Add new vocabulary
    public Vocabulary addVocabulary(Vocabulary vocabulary) {
        return vocabularyRepository.save(vocabulary);
    }

    // Add vocabulary from Korean clip
    public Vocabulary addKoreanWord(
            String word,
            String phonetic,
            String meaning,
            String exampleSentence,
            String clipId,
            int difficultyLevel) {

        // Check if word already exists
        return vocabularyRepository.findByWordAndLanguage(word, "korean")
                .orElseGet(() -> {
                    Vocabulary vocab = Vocabulary.builder()
                            .word(word)
                            .language("korean")
                            .phonetic(phonetic)
                            .partOfSpeech("unknown")
                            .definitions(List.of(
                                    new Vocabulary.Definition(
                                            meaning,
                                            exampleSentence,
                                            "informal"
                                    )
                            ))
                            .clipIds(List.of(clipId))
                            .difficultyLevel(difficultyLevel)
                            .isIdiom(false)
                            .frequency("common")
                            .build();
                    return vocabularyRepository.save(vocab);
                });
    }

    // Delete vocabulary
    public void deleteVocabulary(String id) {
        vocabularyRepository.deleteById(id);
    }
}