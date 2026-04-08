package com.cinelingo.backend.repositories;

import com.cinelingo.backend.models.GameSession;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GameSessionRepository extends MongoRepository<GameSession, String> {
    List<GameSession> findByUserId(String userId);
    List<GameSession> findByUserIdAndMode(String userId, String mode);
    List<GameSession> findByUserIdAndStatus(String userId, String status);
}