package com.campus.lostandfound.controller;

import com.campus.lostandfound.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
@CrossOrigin(origins = "*")
public class StatsController {

    @Autowired
    private ItemService itemService;

    @GetMapping
    public ResponseEntity<Map<String, Long>> getStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalLost", itemService.countByStatus("LOST"));
        stats.put("totalFound", itemService.countByStatus("FOUND"));
        stats.put("totalClaimed", itemService.countByStatus("CLAIMED"));
        stats.put("totalReturned", itemService.countByStatus("RETURNED"));
        return ResponseEntity.ok(stats);
    }
}
