package com.runbuddy.service;

import com.runbuddy.dto.ProfileDTO;
import com.runbuddy.entity.Profile;
import com.runbuddy.entity.User;
import com.runbuddy.repository.ProfileRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProfileService {
    private final ProfileRepository profileRepository;

    public ProfileService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    public Profile updateProfile(Long userId, ProfileDTO dto) {
        Profile profile = profileRepository.findByUserId(userId).orElse(new Profile());
        User user = new User();
        user.setId(userId);
        profile.setUser(user);
        profile.setFullName(dto.getFullName());
        if (dto.getLng() != null && dto.getLat() != null) {
            profile.setLocation("POINT(" + dto.getLng() + " " + dto.getLat() + ")");
        }
        return profileRepository.save(profile);
    }

    public List<Profile> findNearby(double lat, double lng, double radius, String filter) {
        return profileRepository.findNearbyUsers(lat, lng, radius);
    }
}