package com.cinelingo.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@Configuration
@EnableMongoAuditing
@EnableMongoRepositories(basePackages = "com.cinelingo.backend.repositories")
public class MongoConfig {
    // MongoDB is auto-configured by Spring Boot
    // This class enables auditing and repository scanning
}