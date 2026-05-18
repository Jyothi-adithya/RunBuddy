package com.runbuddy.repository;

import com.runbuddy.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdOrderByTimestampDesc(Long userId);

    Optional<Notification> findByIdAndUserId(Long id, Long userId);
}
