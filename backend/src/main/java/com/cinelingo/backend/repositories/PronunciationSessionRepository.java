package com.cinelingo.backend.repositories;

import com.cinelingo.backend.models.PronunciationSession;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PronunciationSessionRepository extends MongoRepository<PronunciationSession, String> {
    List<PronunciationSession> findByUserId(String userId);
    List<PronunciationSession> findByUserIdAndClipId(String userId, String clipId);
}