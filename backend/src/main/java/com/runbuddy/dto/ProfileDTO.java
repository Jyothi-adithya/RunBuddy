package com.runbuddy.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class ProfileDTO {
    @Size(max = 100, message = "Full name cannot exceed 100 characters")
    private String fullName;

    @Pattern(regexp = "^(BEGINNER|INTERMEDIATE|ADVANCED)?$", message = "Running level must be BEGINNER, INTERMEDIATE or ADVANCED")
    private String runningLevel;

    @DecimalMin(value = "2.0", message = "Average pace must be at least 2.0")
    @DecimalMax(value = "20.0", message = "Average pace must be at most 20.0")
    private Double averagePace;

    @DecimalMin(value = "1.0", message = "Preferred distance must be at least 1.0")
    @DecimalMax(value = "100.0", message = "Preferred distance must be at most 100.0")
    private Double preferredDistance;

    @Pattern(regexp = "^(MALE|FEMALE|OTHER)?$", message = "Gender must be MALE, FEMALE or OTHER")
    private String gender;

    @Size(max = 255, message = "Profile photo URL cannot exceed 255 characters")
    private String profilePhotoUrl;

    @Size(max = 2000, message = "Availability cannot exceed 2000 characters")
    private String availability;

    @Pattern(regexp = "^(EXACT|APPROXIMATE)?$", message = "Privacy level must be EXACT or APPROXIMATE")
    private String privacyLevel;

    @Size(max = 100, message = "Emergency contact cannot exceed 100 characters")
    private String emergencyContact;

    @Pattern(regexp = "^$|\\d{4}-\\d{2}-\\d{2}", message = "Date of birth must be in YYYY-MM-DD format")
    private String dateOfBirth;

    @DecimalMin(value = "-90.0", message = "Latitude must be >= -90")
    @DecimalMax(value = "90.0", message = "Latitude must be <= 90")
    private Double lat;

    @DecimalMin(value = "-180.0", message = "Longitude must be >= -180")
    @DecimalMax(value = "180.0", message = "Longitude must be <= 180")
    private Double lng;

    public ProfileDTO() {
    }

    public ProfileDTO(String fullName, String runningLevel, Double averagePace, Double preferredDistance, String gender,
                      String profilePhotoUrl, String availability, String privacyLevel, String emergencyContact,
                      String dateOfBirth, Double lat, Double lng) {
        this.fullName = fullName;
        this.runningLevel = runningLevel;
        this.averagePace = averagePace;
        this.preferredDistance = preferredDistance;
        this.gender = gender;
        this.profilePhotoUrl = profilePhotoUrl;
        this.availability = availability;
        this.privacyLevel = privacyLevel;
        this.emergencyContact = emergencyContact;
        this.dateOfBirth = dateOfBirth;
        this.lat = lat;
        this.lng = lng;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
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

    public String getAvailability() {
        return availability;
    }

    public void setAvailability(String availability) {
        this.availability = availability;
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

    public String getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(String dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public Double getLat() {
        return lat;
    }

    public void setLat(Double lat) {
        this.lat = lat;
    }

    public Double getLng() {
        return lng;
    }

    public void setLng(Double lng) {
        this.lng = lng;
    }
}
