package com.cinelingo.backend.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
public class TestController {

    @GetMapping("/")
    public Map<String, String> home() {
        return Map.of(
                "app", "CineLingo",
                "status", "running",
                "message", "Korean Language Learning App is Live!"
        );
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of(
                "status", "healthy",
                "database", "MongoDB connected"
        );
    }
}
