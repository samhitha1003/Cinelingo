package com.cinelingo.backend.repositories;

import com.cinelingo.backend.models.Challenge;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ChallengeRepository extends MongoRepository<Challenge, String> {
    List<Challenge> findByToUserIdAndStatus(String userId, String status);
    List<Challenge> findByFromUserId(String userId);
    List<Challenge> findByStatus(String status);
}