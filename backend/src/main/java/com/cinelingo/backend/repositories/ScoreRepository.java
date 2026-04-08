package com.cinelingo.backend.repositories;

import com.cinelingo.backend.models.Score;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface ScoreRepository extends MongoRepository<Score, String> {

    List<Score> findByUserIdOrderByPlayedAtDesc(String userId);

    List<Score> findAllByOrderByTotalScoreDesc();

    List<Score> findByGameModeOrderByTotalScoreDesc(String gameMode);

    @Query(value = "{ 'userId': ?0 }", sort = "{ 'totalScore': -1 }")
    List<Score> findTopScoresByUserId(String userId);

    long countByUserId(String userId);

    long countByUserIdAndStatus(String userId, String status);
}