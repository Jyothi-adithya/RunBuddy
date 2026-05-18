package com.runbuddy.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class FcmTokenDTO {
    @NotBlank(message = "Token is required")
    @Size(max = 4096, message = "Token is too long")
    private String token;

    public FcmTokenDTO() {
    }

    public FcmTokenDTO(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
