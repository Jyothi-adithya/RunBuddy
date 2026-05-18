package com.runbuddy.controller;

import com.runbuddy.entity.PartnerRequest;
import com.runbuddy.entity.Profile;
import com.runbuddy.repository.PartnerRequestRepository;
import com.runbuddy.service.ProfileService;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;
import org.springframework.security.core.Authentication;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Locale;

@RestController
@RequestMapping("/api/search")
@Validated
public class SearchController {

    private final ProfileService profileService;
    private final PartnerRequestRepository partnerRequestRepository;
    private final JdbcTemplate jdbcTemplate;

    public SearchController(ProfileService profileService,
                            PartnerRequestRepository partnerRequestRepository,
                            JdbcTemplate jdbcTemplate) {
        this.profileService = profileService;
        this.partnerRequestRepository = partnerRequestRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/nearby-users")
    public List<Map<String, Object>> nearbyUsers(@RequestParam @DecimalMin(value = "-90.0", message = "lat must be >= -90") @DecimalMax(value = "90.0", message = "lat must be <= 90") double lat,
                                                 @RequestParam @DecimalMin(value = "-180.0", message = "lng must be >= -180") @DecimalMax(value = "180.0", message = "lng must be <= 180") double lng,
                                                 @RequestParam @Positive(message = "radius must be > 0") @DecimalMax(value = "50.0", message = "radius must be <= 50") double radius) {
        String sql = """
                SELECT p.id, p.full_name, p.running_level, p.average_pace,
                       ST_Y(p.location) AS lat, ST_X(p.location) AS lng
                FROM profiles p
                WHERE p.location IS NOT NULL
                  AND ST_Distance_Sphere(p.location, ST_SRID(POINT(?, ?), 4326)) <= (? * 1000)
                """;

        List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql, lng, lat, radius);
        List<Map<String, Object>> result = new ArrayList<>();

        for (Map<String, Object> row : rows) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", ((Number) row.get("id")).longValue());
            item.put("fullName", row.get("full_name"));
            item.put("runningLevel", row.get("running_level"));
            item.put("averagePace", row.get("average_pace"));

            Map<String, Double> location = new HashMap<>();
            location.put("lat", ((Number) row.get("lat")).doubleValue());
            location.put("lng", ((Number) row.get("lng")).doubleValue());
            item.put("location", location);
            result.add(item);
        }

        return result;
    }

    @GetMapping("/nearby-requests")
    public List<Map<String, Object>> nearbyRequests(@RequestParam @DecimalMin(value = "-90.0", message = "lat must be >= -90") @DecimalMax(value = "90.0", message = "lat must be <= 90") double lat,
                                                    @RequestParam @DecimalMin(value = "-180.0", message = "lng must be >= -180") @DecimalMax(value = "180.0", message = "lng must be <= 180") double lng,
                                                    @RequestParam @Positive(message = "radius must be > 0") @DecimalMax(value = "50.0", message = "radius must be <= 50") double radius,
                                                    @RequestParam(required = false) @Positive(message = "minPace must be > 0") Double minPace,
                                                    @RequestParam(required = false) @Positive(message = "maxPace must be > 0") Double maxPace,
                                                    @RequestParam(required = false) @Positive(message = "minDistance must be > 0") Double minDistance,
                                                    @RequestParam(required = false) @Positive(message = "maxDistance must be > 0") Double maxDistance,
                                                    @RequestParam(required = false) String runningLevel,
                                                    @RequestParam(defaultValue = "true") boolean openOnly) {
        StringBuilder sql = new StringBuilder("""
              SELECT pr.id, pr.distance, pr.pace, pr.status, pr.notes,
                       ST_Y(pr.meeting_location) AS lat, ST_X(pr.meeting_location) AS lng,
                  p.running_level AS running_level,
                  COALESCE(p.full_name, u.username) AS owner_name,
                  p.average_pace AS owner_average_pace
                FROM partner_requests pr
              INNER JOIN users u ON u.id = pr.user_id
                LEFT JOIN profiles p ON p.user_id = pr.user_id
                WHERE ST_Distance_Sphere(pr.meeting_location, ST_SRID(POINT(?, ?), 4326)) <= (? * 1000)
                """);

        List<Object> params = new ArrayList<>();
        params.add(lng);
        params.add(lat);
        params.add(radius);

        if (openOnly) {
            sql.append(" AND UPPER(pr.status) = 'OPEN'");
        }

        if (minPace != null) {
            sql.append(" AND pr.pace >= ?");
            params.add(minPace);
        }

        if (maxPace != null) {
            sql.append(" AND pr.pace <= ?");
            params.add(maxPace);
        }

        if (minDistance != null) {
            sql.append(" AND pr.distance >= ?");
            params.add(minDistance);
        }

        if (maxDistance != null) {
            sql.append(" AND pr.distance <= ?");
            params.add(maxDistance);
        }

        if (runningLevel != null && !runningLevel.isBlank()) {
            sql.append(" AND UPPER(COALESCE(p.running_level, '')) = ?");
            params.add(runningLevel.trim().toUpperCase(Locale.ROOT));
        }

        sql.append(" ORDER BY pr.date_time ASC");

        List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql.toString(), params.toArray());
        List<Map<String, Object>> result = new ArrayList<>();

        for (Map<String, Object> row : rows) {
            Map<String, Double> meetingLocation = new HashMap<>();
            meetingLocation.put("lat", ((Number) row.get("lat")).doubleValue());
            meetingLocation.put("lng", ((Number) row.get("lng")).doubleValue());

            Map<String, Object> item = new HashMap<>();
            item.put("id", ((Number) row.get("id")).longValue());
            item.put("distance", ((Number) row.get("distance")).doubleValue());
            item.put("pace", ((Number) row.get("pace")).doubleValue());
            item.put("meetingLocation", meetingLocation);
            item.put("status", row.get("status"));
            item.put("notes", row.get("notes"));
            item.put("runningLevel", row.get("running_level"));
            item.put("ownerName", row.get("owner_name"));
            item.put("ownerAveragePace", row.get("owner_average_pace"));
            result.add(item);
        }

        return result;
    }

    @GetMapping("/run-history")
    public List<Map<String, Object>> runHistory(Authentication authentication,
                            @RequestParam(defaultValue = "20") @Min(value = 1, message = "limit must be >= 1") @Max(value = 100, message = "limit must be <= 100") int limit,
                            @RequestParam(required = false) String status) {
        int safeLimit = Math.max(1, Math.min(100, limit));
        String email = authentication.getName();

        StringBuilder sql = new StringBuilder("""
                SELECT pr.id, pr.date_time, pr.distance, pr.pace, pr.status, pr.notes,
                       ST_Y(pr.meeting_location) AS lat, ST_X(pr.meeting_location) AS lng
                FROM partner_requests pr
                INNER JOIN users u ON u.id = pr.user_id
                WHERE u.email = ?
            """);

        List<Object> params = new ArrayList<>();
        params.add(email);

        if (status != null && !status.isBlank()) {
            sql.append(" AND UPPER(pr.status) = ?");
            params.add(status.trim().toUpperCase(Locale.ROOT));
        }

        sql.append(" ORDER BY pr.date_time DESC LIMIT ?");
        params.add(safeLimit);

        List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql.toString(), params.toArray());
        List<Map<String, Object>> result = new ArrayList<>();

        for (Map<String, Object> row : rows) {
            Map<String, Object> item = new HashMap<>();
            Map<String, Double> meetingLocation = new HashMap<>();
            meetingLocation.put("lat", ((Number) row.get("lat")).doubleValue());
            meetingLocation.put("lng", ((Number) row.get("lng")).doubleValue());

            item.put("id", ((Number) row.get("id")).longValue());
            item.put("dateTime", row.get("date_time"));
            item.put("distance", ((Number) row.get("distance")).doubleValue());
            item.put("pace", ((Number) row.get("pace")).doubleValue());
            item.put("status", row.get("status"));
            item.put("notes", row.get("notes"));
            item.put("meetingLocation", meetingLocation);
            result.add(item);
        }

        return result;
    }
}
