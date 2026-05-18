package com.runbuddy.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public class NotificationDTO {
    @Positive(message = "Notification id must be positive")
    private Long id;

    @NotBlank(message = "Notification content is required")
    @Size(max = 500, message = "Notification content cannot exceed 500 characters")
    private String content;
    private boolean isRead;
    private LocalDateTime timestamp;

    public NotificationDTO() {
    }

    public NotificationDTO(Long id, String content, boolean isRead, LocalDateTime timestamp) {
        this.id = id;
        this.content = content;
        this.isRead = isRead;
        this.timestamp = timestamp;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean read) {
        isRead = read;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
