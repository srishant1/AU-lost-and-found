package com.campus.lostandfound.controller;

import com.campus.lostandfound.model.Claim;
import com.campus.lostandfound.service.ClaimService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/claims")
@CrossOrigin(origins = "*")
public class ClaimController {

    @Autowired
    private ClaimService claimService;

    // Submit a claim for an item
    @PostMapping
    public ResponseEntity<Claim> createClaim(@Valid @RequestBody Claim claim) {
        Claim createdClaim = claimService.createClaim(claim);
        return new ResponseEntity<>(createdClaim, HttpStatus.CREATED);
    }

    // Get all claims for a specific item
    @GetMapping("/item/{itemId}")
    public ResponseEntity<List<Claim>> getClaimsByItemId(@PathVariable Long itemId) {
        List<Claim> claims = claimService.getClaimsByItemId(itemId);
        return ResponseEntity.ok(claims);
    }

    // Approve a claim
    @PutMapping("/{id}/approve")
    public ResponseEntity<Claim> approveClaim(@PathVariable Long id) {
        Claim claim = claimService.approveClaim(id);
        if (claim != null) {
            return ResponseEntity.ok(claim);
        }
        return ResponseEntity.notFound().build();
    }

    // Reject a claim
    @PutMapping("/{id}/reject")
    public ResponseEntity<Claim> rejectClaim(@PathVariable Long id) {
        Claim claim = claimService.rejectClaim(id);
        if (claim != null) {
            return ResponseEntity.ok(claim);
        }
        return ResponseEntity.notFound().build();
    }
}
