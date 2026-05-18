package com.runbuddy.service;

import com.runbuddy.dto.NotificationDTO;
import com.runbuddy.entity.Notification;
import com.runbuddy.entity.User;
import com.runbuddy.repository.NotificationRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @InjectMocks
    private NotificationService notificationService;

    @Test
    public void testGetForUserMapsNotifications() {
        Notification n1 = new Notification();
        n1.setId(10L);
        n1.setContent("First notification");
        n1.setRead(false);
        n1.setTimestamp(LocalDateTime.now());

        Notification n2 = new Notification();
        n2.setId(11L);
        n2.setContent("Second notification");
        n2.setRead(true);
        n2.setTimestamp(LocalDateTime.now().minusMinutes(1));

        when(notificationRepository.findByUserIdOrderByTimestampDesc(7L)).thenReturn(List.of(n1, n2));

        List<NotificationDTO> result = notificationService.getForUser(7L);

        assertEquals(2, result.size());
        assertEquals("First notification", result.get(0).getContent());
        assertFalse(result.get(0).isRead());
    }

    @Test
    public void testMarkAsReadReturnsFalseWhenNotFound() {
        when(notificationRepository.findByIdAndUserId(100L, 9L)).thenReturn(Optional.empty());

        boolean updated = notificationService.markAsRead(9L, 100L);

        assertFalse(updated);
    }

    @Test
    public void testMarkAsReadUpdatesNotification() {
        Notification notification = new Notification();
        notification.setId(55L);
        notification.setRead(false);

        when(notificationRepository.findByIdAndUserId(55L, 9L)).thenReturn(Optional.of(notification));

        boolean updated = notificationService.markAsRead(9L, 55L);

        assertTrue(updated);
        assertTrue(notification.isRead());
        verify(notificationRepository).save(notification);
    }

    @Test
    public void testCreateForUser() {
        when(notificationRepository.save(any(Notification.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Notification notification = notificationService.createForUser(12L, "New alert");

        assertEquals("New alert", notification.getContent());
        assertEquals(12L, notification.getUser().getId());
        assertFalse(notification.isRead());
    }
}
