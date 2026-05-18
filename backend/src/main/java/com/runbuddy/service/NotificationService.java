package com.runbuddy.service;

import com.runbuddy.dto.NotificationDTO;
import com.runbuddy.entity.Notification;
import com.runbuddy.entity.User;
import com.runbuddy.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public List<NotificationDTO> getForUser(Long userId) {
        return notificationRepository.findByUserIdOrderByTimestampDesc(userId)
                .stream()
                .map(this::toDto)
                .toList();
    }

    public boolean markAsRead(Long userId, Long notificationId) {
        return notificationRepository.findByIdAndUserId(notificationId, userId)
                .map(notification -> {
                    notification.setRead(true);
                    notificationRepository.save(notification);
                    return true;
                })
                .orElse(false);
    }

    public Notification createForUser(Long userId, String content) {
        User user = new User();
        user.setId(userId);

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setContent(content);
        notification.setRead(false);
        return notificationRepository.save(notification);
    }

    private NotificationDTO toDto(Notification notification) {
        return new NotificationDTO(
                notification.getId(),
                notification.getContent(),
                notification.isRead(),
                notification.getTimestamp()
        );
    }
}
