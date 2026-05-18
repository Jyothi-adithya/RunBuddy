package com.runbuddy.repository;

import com.runbuddy.entity.PartnerRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PartnerRequestRepository extends JpaRepository<PartnerRequest, Long> {
    List<PartnerRequest> findByStatusIgnoreCase(String status);
}
