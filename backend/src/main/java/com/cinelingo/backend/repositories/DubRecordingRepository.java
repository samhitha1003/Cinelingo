package com.cinelingo.backend.repositories;

import com.cinelingo.backend.models.DubRecording;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DubRecordingRepository extends MongoRepository<DubRecording, String> {
    List<DubRecording> findByUserId(String userId);
    List<DubRecording> findByClipId(String clipId);
    List<DubRecording> findByIsPublicTrue();
}