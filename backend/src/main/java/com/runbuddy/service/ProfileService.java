package com.runbuddy.service;

import com.runbuddy.dto.ProfileDTO;
import com.runbuddy.entity.Profile;
import com.runbuddy.entity.User;
import com.runbuddy.repository.ProfileRepository;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProfileService {
    private static final GeometryFactory GEOMETRY_FACTORY = new GeometryFactory(new PrecisionModel(), 4326);
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
            profile.setLocation(toPoint(dto.getLng(), dto.getLat()));
        }
        return profileRepository.save(profile);
    }

    public List<Profile> findNearby(double lat, double lng, double radius, String filter) {
        return profileRepository.findNearbyUsers(lat, lng, radius);
    }

    private Point toPoint(Double lng, Double lat) {
        if (lng == null || lat == null) {
            return null;
        }

        return GEOMETRY_FACTORY.createPoint(new Coordinate(lng, lat));
    }
}