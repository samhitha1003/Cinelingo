package com.cinelingo.backend.repositories;

import com.cinelingo.backend.models.UserProgress;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface UserProgressRepository extends MongoRepository<UserProgress, String> {
    Optional<UserProgress> findByUserId(String userId);
    void deleteByUserId(String userId);
}