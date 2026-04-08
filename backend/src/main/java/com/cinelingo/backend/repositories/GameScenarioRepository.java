package com.cinelingo.backend.repositories;

import com.cinelingo.backend.models.GameScenario;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GameScenarioRepository extends MongoRepository<GameScenario, String> {
    List<GameScenario> findByLanguage(String language);
    List<GameScenario> findByType(String type);
    List<GameScenario> findByUnlockedAtLevelLessThanEqual(int level);
}