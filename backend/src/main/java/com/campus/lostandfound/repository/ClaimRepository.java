package com.campus.lostandfound.repository;

import com.campus.lostandfound.model.Claim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClaimRepository extends JpaRepository<Claim, Long> {

    List<Claim> findByItemId(Long itemId);

    List<Claim> findByClaimerEmail(String claimerEmail);

    long countByStatus(String status);
}
