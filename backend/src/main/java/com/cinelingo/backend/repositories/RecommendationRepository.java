package com.cinelingo.backend.repositories;

import com.cinelingo.backend.models.Recommendation;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface RecommendationRepository extends MongoRepository<Recommendation, String> {
    List<Recommendation> findByUserIdOrderByCreatedAtDesc(String userId);
    List<Recommendation> findByUserIdAndViewedFalse(String userId);
}