package com.campus.lostandfound.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "items")
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    @Column(length = 1000)
    private String description;

    @NotBlank(message = "Category is required")
    private String category;

    private String location;

    private LocalDateTime dateReported;

    @NotBlank(message = "Status is required")
    private String status; // LOST, FOUND, CLAIMED, RETURNED

    @NotBlank(message = "Reporter name is required")
    private String reporterName;

    @NotBlank(message = "Reporter email is required")
    @Email(message = "Invalid email format")
    private String reporterEmail;

    private String contactPhone;

    private String imageUrl;

    @PrePersist
    protected void onCreate() {
        if (dateReported == null) {
            dateReported = LocalDateTime.now();
        }
    }

    // Constructors
    public Item() {}

    public Item(String title, String description, String category, String location,
                String status, String reporterName, String reporterEmail,
                String contactPhone, String imageUrl) {
        this.title = title;
        this.description = description;
        this.category = category;
        this.location = location;
        this.status = status;
        this.reporterName = reporterName;
        this.reporterEmail = reporterEmail;
        this.contactPhone = contactPhone;
        this.imageUrl = imageUrl;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public LocalDateTime getDateReported() { return dateReported; }
    public void setDateReported(LocalDateTime dateReported) { this.dateReported = dateReported; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getReporterName() { return reporterName; }
    public void setReporterName(String reporterName) { this.reporterName = reporterName; }

    public String getReporterEmail() { return reporterEmail; }
    public void setReporterEmail(String reporterEmail) { this.reporterEmail = reporterEmail; }

    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
