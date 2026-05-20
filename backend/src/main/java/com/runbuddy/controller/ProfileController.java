package com.runbuddy.controller;

import com.runbuddy.dto.FcmTokenDTO;
import com.runbuddy.dto.ProfileDTO;
import com.runbuddy.entity.Profile;
import com.runbuddy.entity.User;
import com.runbuddy.repository.ProfileRepository;
import com.runbuddy.repository.UserRepository;
import com.runbuddy.service.FcmService;
import jakarta.validation.Valid;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/profiles")
@Validated
public class ProfileController {

    private static final GeometryFactory GEOMETRY_FACTORY = new GeometryFactory(new PrecisionModel(), 4326);

    private final FcmService fcmService;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;

    public ProfileController(FcmService fcmService, UserRepository userRepository, ProfileRepository profileRepository) {
        this.fcmService = fcmService;
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getMyProfile(Authentication auth) {
        User user = getAuthenticatedUser(auth);
        Profile profile = profileRepository.findByUserId(user.getId()).orElse(null);

        Map<String, Object> payload = new HashMap<>();
        if (profile != null) {
            payload.put("id", profile.getId());
            payload.put("fullName", profile.getFullName());
            payload.put("dateOfBirth", profile.getDateOfBirth());
            payload.put("runningLevel", profile.getRunningLevel());
            payload.put("averagePace", profile.getAveragePace());
            payload.put("preferredDistance", profile.getPreferredDistance());
            payload.put("gender", profile.getGender());
            payload.put("profilePhotoUrl", profile.getProfilePhotoUrl());
            payload.put("availability", profile.getAvailability());
            payload.put("privacyLevel", profile.getPrivacyLevel());
            payload.put("emergencyContact", profile.getEmergencyContact());
        }
        return ResponseEntity.ok(payload);
    }

    @GetMapping("/{userId}/summary")
    public ResponseEntity<Map<String, Object>> getProfileSummary(@PathVariable Long userId, Authentication auth) {
        // Keep endpoint authenticated so only signed-in users can view runner summaries.
        getAuthenticatedUser(auth);

        User targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Profile profile = profileRepository.findByUserId(userId).orElse(null);

        Map<String, Object> payload = new HashMap<>();
        payload.put("userId", targetUser.getId());
        payload.put("displayName", profile != null && profile.getFullName() != null && !profile.getFullName().isBlank()
                ? profile.getFullName()
                : targetUser.getUsername());
        payload.put("runningLevel", profile != null ? profile.getRunningLevel() : null);
        payload.put("averagePace", profile != null ? profile.getAveragePace() : null);
        payload.put("preferredDistance", profile != null ? profile.getPreferredDistance() : null);
        payload.put("privacyLevel", profile != null ? profile.getPrivacyLevel() : null);

        return ResponseEntity.ok(payload);
    }

    @PutMapping("/me")
    public ResponseEntity<Map<String, Object>> updateMyProfile(@Valid @RequestBody ProfileDTO dto, Authentication auth) {
        User user = getAuthenticatedUser(auth);
        Profile profile = profileRepository.findByUserId(user.getId()).orElse(new Profile());
        profile.setUser(user);

        if (dto.getFullName() != null) {
            profile.setFullName(stringValue(dto.getFullName()));
        }
        if (dto.getDateOfBirth() != null) {
            profile.setDateOfBirth(stringValue(dto.getDateOfBirth()));
        }
        if (dto.getRunningLevel() != null) {
            profile.setRunningLevel(stringValue(dto.getRunningLevel()));
        }
        if (dto.getAveragePace() != null) {
            profile.setAveragePace(dto.getAveragePace());
        }
        if (dto.getPreferredDistance() != null) {
            profile.setPreferredDistance(dto.getPreferredDistance());
        }
        if (dto.getGender() != null) {
            profile.setGender(stringValue(dto.getGender()));
        }
        if (dto.getProfilePhotoUrl() != null) {
            profile.setProfilePhotoUrl(stringValue(dto.getProfilePhotoUrl()));
        }
        if (dto.getAvailability() != null) {
            profile.setAvailability(stringValue(dto.getAvailability()));
        }
        if (dto.getPrivacyLevel() != null) {
            profile.setPrivacyLevel(stringValue(dto.getPrivacyLevel()));
        }
        if (dto.getEmergencyContact() != null) {
            profile.setEmergencyContact(stringValue(dto.getEmergencyContact()));
        }

        if (profile.getLocation() == null) {
            profile.setLocation(defaultLocation());
        }

        Profile saved = profileRepository.save(profile);

        Map<String, Object> payload = new HashMap<>();
        payload.put("id", saved.getId());
        payload.put("fullName", saved.getFullName());
        payload.put("dateOfBirth", saved.getDateOfBirth());
        payload.put("runningLevel", saved.getRunningLevel());
        payload.put("averagePace", saved.getAveragePace());
        payload.put("preferredDistance", saved.getPreferredDistance());
        payload.put("gender", saved.getGender());
        payload.put("profilePhotoUrl", saved.getProfilePhotoUrl());
        payload.put("availability", saved.getAvailability());
        payload.put("privacyLevel", saved.getPrivacyLevel());
        payload.put("emergencyContact", saved.getEmergencyContact());
        return ResponseEntity.ok(payload);
    }

    @PostMapping("/fcm-token")
    public ResponseEntity<String> saveFcmToken(@Valid @RequestBody FcmTokenDTO body, Authentication auth) {
        User user = getAuthenticatedUser(auth);

        fcmService.saveToken(user.getId(), body.getToken());
        return ResponseEntity.ok("FCM token saved successfully");
    }

    private User getAuthenticatedUser(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("Not authenticated");
        }

        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private String stringValue(Object value) {
        if (value == null) {
            return null;
        }
        String text = String.valueOf(value).trim();
        return text.isEmpty() ? null : text;
    }

    private Point defaultLocation() {
        return GEOMETRY_FACTORY.createPoint(new Coordinate(77.5946, 12.9716));
    }

}