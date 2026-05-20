package com.runbuddy.controller;

import com.runbuddy.dto.CreateRequestDTO;
import com.runbuddy.dto.MeetingLocationDTO;
import com.runbuddy.dto.RequestResponseDTO;
import com.runbuddy.entity.PartnerRequest;
import com.runbuddy.entity.RequestResponse;
import com.runbuddy.entity.User;
import com.runbuddy.repository.PartnerRequestRepository;
import com.runbuddy.repository.RequestResponseRepository;
import com.runbuddy.repository.UserRepository;
import jakarta.validation.Valid;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.http.HttpStatus;
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

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/requests")
@Validated
public class RequestController {

    private static final GeometryFactory GEOMETRY_FACTORY = new GeometryFactory(new PrecisionModel(), 4326);

    private final PartnerRequestRepository partnerRequestRepository;
    private final RequestResponseRepository requestResponseRepository;
    private final UserRepository userRepository;

    public RequestController(PartnerRequestRepository partnerRequestRepository,
                             RequestResponseRepository requestResponseRepository,
                             UserRepository userRepository) {
        this.partnerRequestRepository = partnerRequestRepository;
        this.requestResponseRepository = requestResponseRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createRequest(@Valid @RequestBody CreateRequestDTO body,
                                                             Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        PartnerRequest request = new PartnerRequest();
        request.setUser(user);
        request.setDateTime(parseDateTime(body.getDateTime()));
        request.setDistance(body.getDistance());
        request.setPace(body.getPace());
        request.setNotes(cleanText(body.getNotes()));
        request.setMeetingLocation(toPoint(body.getMeetingLocation()));
        request.setStatus("OPEN");

        PartnerRequest saved = partnerRequestRepository.save(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(toRequestDetails(saved, user, List.of()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getRequest(@PathVariable Long id, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        PartnerRequest request = partnerRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        List<RequestResponse> responses = requestResponseRepository.findByRequest_IdOrderByCreatedAtAsc(id);
        return ResponseEntity.ok(toRequestDetails(request, user, responses));
    }

    @PostMapping("/{id}/respond")
    public ResponseEntity<RequestResponseDTO> respondToRequest(@PathVariable Long id, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        PartnerRequest request = partnerRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (request.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        RequestResponse response = requestResponseRepository
                .findByRequest_IdAndResponder_Id(id, user.getId())
                .orElseGet(() -> {
                    RequestResponse created = new RequestResponse();
                    created.setRequest(request);
                    created.setResponder(user);
                    created.setStatus("PENDING");
                    return requestResponseRepository.save(created);
                });

        return ResponseEntity.ok(toResponseDto(response));
    }

    @PutMapping("/{id}/accept/{responseId}")
    public ResponseEntity<Void> acceptResponse(@PathVariable Long id,
                                               @PathVariable Long responseId,
                                               Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        PartnerRequest request = partnerRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!request.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        RequestResponse response = requestResponseRepository.findById(responseId)
                .orElseThrow(() -> new RuntimeException("Response not found"));

        if (!response.getRequest().getId().equals(request.getId())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        response.setStatus("ACCEPTED");
        requestResponseRepository.save(response);

        request.setStatus("MATCHED");
        partnerRequestRepository.save(request);

        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/reject/{responseId}")
    public ResponseEntity<Void> rejectResponse(@PathVariable Long id,
                                               @PathVariable Long responseId,
                                               Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        PartnerRequest request = partnerRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!request.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        RequestResponse response = requestResponseRepository.findById(responseId)
                .orElseThrow(() -> new RuntimeException("Response not found"));

        if (!response.getRequest().getId().equals(request.getId())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        response.setStatus("REJECTED");
        requestResponseRepository.save(response);

        return ResponseEntity.noContent().build();
    }

    private Map<String, Object> toRequestDetails(PartnerRequest request, User viewer, List<RequestResponse> responses) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("id", request.getId());
        payload.put("userId", request.getUser().getId());
        payload.put("dateTime", request.getDateTime());
        payload.put("distance", request.getDistance());
        payload.put("pace", request.getPace());
        payload.put("status", request.getStatus());
        payload.put("notes", request.getNotes());
        payload.put("isOwner", request.getUser().getId().equals(viewer.getId()));

        Point location = request.getMeetingLocation();
        if (location != null) {
            Map<String, Double> meetingLocation = new HashMap<>();
            meetingLocation.put("lat", location.getY());
            meetingLocation.put("lng", location.getX());
            payload.put("meetingLocation", meetingLocation);
        }

        List<RequestResponseDTO> responseDtos = responses.stream()
                .map(this::toResponseDto)
                .toList();
        payload.put("responses", responseDtos);

        return payload;
    }

    private RequestResponseDTO toResponseDto(RequestResponse response) {
        return new RequestResponseDTO(
                response.getId(),
                response.getResponder().getId(),
                response.getStatus()
        );
    }

    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Not authenticated");
        }

        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private Point toPoint(MeetingLocationDTO location) {
        return GEOMETRY_FACTORY.createPoint(new Coordinate(location.getLng(), location.getLat()));
    }

    private LocalDateTime parseDateTime(String value) {
        if (value == null || value.isBlank()) {
            throw new RuntimeException("dateTime is required");
        }

        String trimmed = value.trim();
        try {
            return LocalDateTime.parse(trimmed, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        } catch (DateTimeParseException ex) {
            throw new RuntimeException("Invalid dateTime format");
        }
    }

    private String cleanText(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
