package com.runbuddy.repository;

import com.runbuddy.entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.HashMap;

public interface ProfileRepository extends JpaRepository<Profile, Long> {
    Optional<Profile> findByUserId(Long userId);

    default List<Profile> findNearbyUsers(double lat, double lng, double radius) {
        List<Profile> result = new ArrayList<>();

        for (Profile profile : findAll()) {
            if (profile.getLocation() == null || profile.getLocation().isBlank()) {
                continue;
            }

            Map<String, Double> point = parsePoint(profile.getLocation());
            if (point == null) {
                continue;
            }

            double distanceKm = haversineKm(lat, lng, point.get("lat"), point.get("lng"));
            if (distanceKm <= radius) {
                result.add(profile);
            }
        }

        return result;
    }

    private static Map<String, Double> parsePoint(String pointText) {
        String text = pointText.trim();
        if (!text.startsWith("POINT(")) {
            return null;
        }

        int open = text.indexOf('(');
        int close = text.indexOf(')');
        if (open < 0 || close <= open + 1) {
            return null;
        }

        String[] parts = text.substring(open + 1, close).trim().split("\\s+");
        if (parts.length != 2) {
            return null;
        }

        try {
            double pointLng = Double.parseDouble(parts[0]);
            double pointLat = Double.parseDouble(parts[1]);

            Map<String, Double> location = new HashMap<>();
            location.put("lat", pointLat);
            location.put("lng", pointLng);
            return location;
        } catch (NumberFormatException ex) {
            return null;
        }
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
