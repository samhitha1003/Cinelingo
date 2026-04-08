package com.cinelingo.backend.controllers;

import com.cinelingo.backend.dto.ChallengeRequest;
import com.cinelingo.backend.models.*;
import com.cinelingo.backend.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/social")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class SocialController {

    private final ChallengeRepository challengeRepository;
    private final UserRepository userRepository;

    // 👥 Get friends list for a user
    @GetMapping("/friends/{userId}")
    public ResponseEntity<List<User>> getFriends(@PathVariable String userId) {
        // TODO: Implement proper friend logic with Friend model
        // For now, return sample users (exclude current user)
        List<User> allUsers = userRepository.findAll();
        List<User> friends = allUsers.stream()
                .filter(u -> !u.getId().equals(userId))
                .limit(10)
                .collect(Collectors.toList());

        return ResponseEntity.ok(friends);
    }

    // 🎯 Send challenge to a friend
    @PostMapping("/challenge")
    public ResponseEntity<Challenge> sendChallenge(@RequestBody ChallengeRequest request) {

        Challenge challenge = new Challenge();
        challenge.setFromUserId(request.getFromUserId());
        challenge.setToUserId(request.getToUserId());
        challenge.setScenarioId(request.getScenarioId());
        challenge.setGameMode(request.getGameMode());
        challenge.setMessage(request.getMessage());
        challenge.setStatus("pending");
        challenge.setCreatedAt(LocalDateTime.now());

        Challenge saved = challengeRepository.save(challenge);

        // TODO: Send WebSocket notification to friend
        // notificationService.sendChallengeNotification(request.getToUserId(), saved);

        return ResponseEntity.ok(saved);
    }

    // 📬 Get active challenges for a user
    @GetMapping("/challenges/{userId}")
    public ResponseEntity<List<Challenge>> getActiveChallenges(@PathVariable String userId) {
        List<Challenge> challenges = challengeRepository
                .findByToUserIdAndStatus(userId, "pending");

        return ResponseEntity.ok(challenges);
    }

    // ✅ Accept or decline a challenge
    @PostMapping("/challenge/{challengeId}/respond")
    public ResponseEntity<Challenge> respondToChallenge(
            @PathVariable String challengeId,
            @RequestParam String response) { // "accept" or "decline"

        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new RuntimeException("Challenge not found: " + challengeId));

        challenge.setStatus(response);
        challenge.setRespondedAt(LocalDateTime.now());

        return ResponseEntity.ok(challengeRepository.save(challenge));
    }

    // 🏆 Get challenge leaderboard
    @GetMapping("/challenge/{challengeId}/leaderboard")
    public ResponseEntity<List<Map<String, Object>>> getChallengeLeaderboard(
            @PathVariable String challengeId) {

        // Return scores for this specific challenge
        // TODO: Implement challenge-specific scoring
        return ResponseEntity.ok(new ArrayList<>());
    }
}