package com.campus.lostandfound.config;

import com.campus.lostandfound.model.Item;
import com.campus.lostandfound.repository.ItemRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedDatabase(ItemRepository itemRepository) {
        return args -> {
            // Seed some sample data for demonstration
            itemRepository.save(new Item(
                "Blue Backpack", "Navy blue JanSport backpack with laptop compartment",
                "Bags", "Central Library - 2nd Floor", "LOST",
                "Rahul Sharma", "rahul@campus.edu", "9876543210", null
            ));

            itemRepository.save(new Item(
                "iPhone 14 Pro", "Space black iPhone 14 Pro with cracked screen protector",
                "Electronics", "Cafeteria Block A", "LOST",
                "Priya Patel", "priya@campus.edu", "9876543211", null
            ));

            itemRepository.save(new Item(
                "Calculator (Casio fx-991)", "Scientific calculator found on bench",
                "Electronics", "Engineering Block - Room 204", "FOUND",
                "Amit Kumar", "amit@campus.edu", "9876543212", null
            ));

            itemRepository.save(new Item(
                "Student ID Card", "Found ID card belonging to CSE department student",
                "Documents", "Main Gate Security", "FOUND",
                "Security Office", "security@campus.edu", "9876543213", null
            ));

            itemRepository.save(new Item(
                "Water Bottle (Nalgene)", "Green 1L Nalgene water bottle with stickers",
                "Personal Items", "Sports Complex - Gym", "LOST",
                "Sneha Reddy", "sneha@campus.edu", "9876543214", null
            ));

            itemRepository.save(new Item(
                "Wireless Earbuds", "Black Sony WF-1000XM4 earbuds in charging case",
                "Electronics", "Auditorium - Row 15", "FOUND",
                "Kiran Joshi", "kiran@campus.edu", "9876543215", null
            ));

            System.out.println("✅ Sample data seeded successfully!");
        };
    }
}
