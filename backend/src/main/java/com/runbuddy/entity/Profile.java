package com.runbuddy.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.locationtech.jts.geom.Point;

@Entity
@Table(name = "profiles")
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String fullName;
    private String dateOfBirth;
    private String gender;
    private String profilePhotoUrl;
    private String runningLevel;
    private Double averagePace;
    private Double preferredDistance;
    private String availability;           // JSON as String

    @JdbcTypeCode(SqlTypes.GEOMETRY)
    @Column(columnDefinition = "POINT SRID 4326")
    private Point location;
    private String privacyLevel = "APPROXIMATE";
    private String emergencyContact;

    public Profile() {
    }

    public Profile(Long id, User user, String fullName, String dateOfBirth, String gender, String profilePhotoUrl,
                   String runningLevel, Double averagePace, Double preferredDistance, String availability,
                   Point location, String privacyLevel, String emergencyContact) {
        this.id = id;
        this.user = user;
        this.fullName = fullName;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.profilePhotoUrl = profilePhotoUrl;
        this.runningLevel = runningLevel;
        this.averagePace = averagePace;
        this.preferredDistance = preferredDistance;
        this.availability = availability;
        this.location = location;
        this.privacyLevel = privacyLevel;
        this.emergencyContact = emergencyContact;
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

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(String dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getProfilePhotoUrl() {
        return profilePhotoUrl;
    }

    public void setProfilePhotoUrl(String profilePhotoUrl) {
        this.profilePhotoUrl = profilePhotoUrl;
    }

    public String getRunningLevel() {
        return runningLevel;
    }

    public void setRunningLevel(String runningLevel) {
        this.runningLevel = runningLevel;
    }

    public Double getAveragePace() {
        return averagePace;
    }

    public void setAveragePace(Double averagePace) {
        this.averagePace = averagePace;
    }

    public Double getPreferredDistance() {
        return preferredDistance;
    }

    public void setPreferredDistance(Double preferredDistance) {
        this.preferredDistance = preferredDistance;
    }

    public String getAvailability() {
        return availability;
    }

    public void setAvailability(String availability) {
        this.availability = availability;
    }

    public Point getLocation() {
        return location;
    }

    public void setLocation(Point location) {
        this.location = location;
    }

    public String getPrivacyLevel() {
        return privacyLevel;
    }

    public void setPrivacyLevel(String privacyLevel) {
        this.privacyLevel = privacyLevel;
    }

    public String getEmergencyContact() {
        return emergencyContact;
    }

    public void setEmergencyContact(String emergencyContact) {
        this.emergencyContact = emergencyContact;
    }
}