package com.runbuddy.repository;

import com.runbuddy.entity.Profile;
import org.locationtech.jts.geom.Point;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public interface ProfileRepository extends JpaRepository<Profile, Long> {
    Optional<Profile> findByUserId(Long userId);

    default List<Profile> findNearbyUsers(double lat, double lng, double radius) {
        List<Profile> result = new ArrayList<>();

        for (Profile profile : findAll()) {
            Point location = profile.getLocation();
            if (location == null) {
                continue;
            }

            double distanceKm = haversineKm(lat, lng, location.getY(), location.getX());
            if (distanceKm <= radius) {
                result.add(profile);
            }
        }

        return result;
    }

    private static double haversineKm(double lat1, double lng1, double lat2, double lng2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return 6371.0 * c;
    }
}
