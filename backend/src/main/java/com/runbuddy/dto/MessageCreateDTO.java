package com.runbuddy.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public class MessageCreateDTO {

    @NotNull(message = "Receiver is required")
    @Positive(message = "Receiver id must be positive")
    private Long receiverId;

    @NotBlank(message = "Message content is required")
    @Size(max = 2000, message = "Message content cannot exceed 2000 characters")
    private String content;

    public MessageCreateDTO() {
    }

    public Long getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(Long receiverId) {
        this.receiverId = receiverId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
