package com.runbuddy.repository;

import com.runbuddy.entity.RequestResponse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RequestResponseRepository extends JpaRepository<RequestResponse, Long> {
    List<RequestResponse> findByRequest_IdOrderByCreatedAtAsc(Long requestId);
    Optional<RequestResponse> findByRequest_IdAndResponder_Id(Long requestId, Long responderId);
}
