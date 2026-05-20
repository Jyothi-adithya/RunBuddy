package com.runbuddy.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public class RequestResponseDTO {

    @Positive(message = "Response id must be positive")
    private Long id;

    @Positive(message = "Responder id must be positive")
    private Long responderId;

    @NotBlank(message = "Status is required")
    private String status;

    public RequestResponseDTO() {
    }

    public RequestResponseDTO(Long id, Long responderId, String status) {
        this.id = id;
        this.responderId = responderId;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getResponderId() {
        return responderId;
    }

    public void setResponderId(Long responderId) {
        this.responderId = responderId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
