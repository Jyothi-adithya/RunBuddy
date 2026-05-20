package com.runbuddy.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CreateRequestDTO {

    @NotBlank(message = "Date and time is required")
    private String dateTime;

    @NotNull(message = "Distance is required")
    @DecimalMin(value = "0.5", message = "Distance must be at least 0.5")
    @DecimalMax(value = "200.0", message = "Distance must be at most 200")
    private Double distance;

    @NotNull(message = "Pace is required")
    @DecimalMin(value = "2.0", message = "Pace must be at least 2.0")
    @DecimalMax(value = "20.0", message = "Pace must be at most 20.0")
    private Double pace;

    @Size(max = 1000, message = "Notes cannot exceed 1000 characters")
    private String notes;

    @Valid
    @NotNull(message = "Meeting location is required")
    private MeetingLocationDTO meetingLocation;

    public CreateRequestDTO() {
    }

    public String getDateTime() {
        return dateTime;
    }

    public void setDateTime(String dateTime) {
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

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public MeetingLocationDTO getMeetingLocation() {
        return meetingLocation;
    }

    public void setMeetingLocation(MeetingLocationDTO meetingLocation) {
        this.meetingLocation = meetingLocation;
    }
}
