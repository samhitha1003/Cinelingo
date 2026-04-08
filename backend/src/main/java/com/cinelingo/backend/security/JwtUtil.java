package com.cinelingo.backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    // Set this in application.properties:
    // jwt.secret=your-256-bit-secret-key-here-make-it-long-enough
    // jwt.expiration=86400000  (24 hours in ms)
    @Value("${jwt.secret:cinelingo-super-secret-key-2024-change-this-in-production}")
    private String secret;

    @Value("${jwt.expiration:86400000}")
    private long expiration;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    // Generate token for a userId
    public String generateToken(String userId, String username) {
        return Jwts.builder()
                .subject(userId)
                .claim("username", username)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }

    // Extract userId from token
    public String extractUserId(String token) {
        return getClaims(token).getSubject();
    }

    // Extract username from token
    public String extractUsername(String token) {
        return getClaims(token).get("username", String.class);
    }

    // Validate token
    public boolean isValid(String token) {
        try {
            getClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}