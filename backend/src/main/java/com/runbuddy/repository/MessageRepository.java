package com.runbuddy.repository;

import com.runbuddy.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("""
            SELECT m FROM Message m
            WHERE (m.sender.id = :userId AND m.receiver.id = :partnerId)
               OR (m.sender.id = :partnerId AND m.receiver.id = :userId)
            ORDER BY m.timestamp ASC
            """)
    List<Message> findConversation(@Param("userId") Long userId, @Param("partnerId") Long partnerId);
}
