package com.runbuddy.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import com.runbuddy.entity.User;
import com.runbuddy.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class FcmService {

    private final FirebaseMessaging firebaseMessaging;
    private final UserRepository userRepository;

    public FcmService(FirebaseMessaging firebaseMessaging, UserRepository userRepository) {
        this.firebaseMessaging = firebaseMessaging;
        this.userRepository = userRepository;
    }

    // Save token from frontend
    public void saveToken(Long userId, String token) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setFcmToken(token);
        userRepository.save(user);
    }

    // Send notification to a specific user
    public void sendNotification(Long userId, String title, String body) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getFcmToken() == null || user.getFcmToken().isEmpty()) {
            return; // User has no token
        }

        Message message = Message.builder()
                .setToken(user.getFcmToken())
                .setNotification(Notification.builder()
                        .setTitle(title)
                        .setBody(body)
                        .build())
                .putData("click_action", "FLUTTER_NOTIFICATION_CLICK") // Optional
                .build();

        try {
            firebaseMessaging.send(message);
            System.out.println("✅ Push sent to user " + userId);
        } catch (Exception e) {
            System.err.println("Failed to send push: " + e.getMessage());
        }
    }
}