package com.runbuddy.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.locationtech.jts.geom.Point;

import java.time.LocalDateTime;

@Entity
@Table(name = "partner_requests")
public class PartnerRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "date_time", nullable = false)
    private LocalDateTime dateTime;

    @Column(nullable = false)
    private Double distance;

    @Column(nullable = false)
    private Double pace;

    @JdbcTypeCode(SqlTypes.GEOMETRY)
    @Column(name = "meeting_location", nullable = false, columnDefinition = "POINT SRID 4326")
    private Point meetingLocation;

    private String notes;

    private String status = "OPEN";

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public PartnerRequest() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public Double getDistance() {
        return distance;
    }

    public void setDistance(Double distance) {
        this.distance = distance;
    }

    public Double getPace() {
        return pace;
    }

    public void setPace(Double pace) {
        this.pace = pace;
    }

    public Point getMeetingLocation() {
        return meetingLocation;
    }

    public void setMeetingLocation(Point meetingLocation) {
        this.meetingLocation = meetingLocation;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
