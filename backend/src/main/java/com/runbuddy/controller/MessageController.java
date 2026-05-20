package com.runbuddy.controller;

import com.runbuddy.dto.MessageCreateDTO;
import com.runbuddy.entity.Message;
import com.runbuddy.entity.User;
import com.runbuddy.repository.MessageRepository;
import com.runbuddy.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@Validated
public class MessageController {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public MessageController(MessageRepository messageRepository, UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/{partnerId}")
    public ResponseEntity<List<Map<String, Object>>> getConversation(@PathVariable Long partnerId,
                                                                     Authentication authentication) {
        User user = getAuthenticatedUser(authentication);

        userRepository.findById(partnerId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Map<String, Object>> messages = messageRepository.findConversation(user.getId(), partnerId)
                .stream()
                .map(message -> toMessagePayload(message, user.getId()))
                .toList();

        return ResponseEntity.ok(messages);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> sendMessage(@Valid @RequestBody MessageCreateDTO body,
                                                           Authentication authentication) {
        User sender = getAuthenticatedUser(authentication);
        User receiver = userRepository.findById(body.getReceiverId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(body.getContent().trim());

        Message saved = messageRepository.save(message);
        return ResponseEntity.status(HttpStatus.CREATED).body(toMessagePayload(saved, sender.getId()));
    }

    private Map<String, Object> toMessagePayload(Message message, Long viewerId) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("id", message.getId());
        payload.put("senderId", message.getSender().getId());
        payload.put("receiverId", message.getReceiver().getId());
        payload.put("content", message.getContent());
        payload.put("timestamp", message.getTimestamp());
        payload.put("isMine", message.getSender().getId().equals(viewerId));
        return payload;
    }

    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Not authenticated");
        }

        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
