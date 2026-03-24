package com.campus.lostandfound.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "claims")
public class Claim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long itemId;

    @NotBlank(message = "Claimer name is required")
    private String claimerName;

    @NotBlank(message = "Claimer email is required")
    @Email(message = "Invalid email format")
    private String claimerEmail;

    @Column(length = 1000)
    private String message;

    private String status; // PENDING, APPROVED, REJECTED

    private LocalDateTime claimDate;

    @PrePersist
    protected void onCreate() {
        if (claimDate == null) {
            claimDate = LocalDateTime.now();
        }
        if (status == null) {
            status = "PENDING";
        }
    }

    // Constructors
    public Claim() {}

    public Claim(Long itemId, String claimerName, String claimerEmail, String message) {
        this.itemId = itemId;
        this.claimerName = claimerName;
        this.claimerEmail = claimerEmail;
        this.message = message;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }

    public String getClaimerName() { return claimerName; }
    public void setClaimerName(String claimerName) { this.claimerName = claimerName; }

    public String getClaimerEmail() { return claimerEmail; }
    public void setClaimerEmail(String claimerEmail) { this.claimerEmail = claimerEmail; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getClaimDate() { return claimDate; }
    public void setClaimDate(LocalDateTime claimDate) { this.claimDate = claimDate; }
}
