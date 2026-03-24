package com.campus.lostandfound.controller;

import com.campus.lostandfound.model.Item;
import com.campus.lostandfound.service.ItemService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "*")
public class ItemController {

    @Autowired
    private ItemService itemService;

    // Create a new item (report lost or found)
    @PostMapping
    public ResponseEntity<Item> createItem(@Valid @RequestBody Item item) {
        Item createdItem = itemService.createItem(item);
        return new ResponseEntity<>(createdItem, HttpStatus.CREATED);
    }

    // Get all items with optional filters
    @GetMapping
    public ResponseEntity<List<Item>> getItems(
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "keyword", required = false) String keyword) {
        List<Item> items = itemService.filterItems(status, category, keyword);
        return ResponseEntity.ok(items);
    }

    // Get a single item by ID
    @GetMapping("/{id}")
    public ResponseEntity<Item> getItemById(@PathVariable Long id) {
        Optional<Item> item = itemService.getItemById(id);
        return item.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    // Update an item
    @PutMapping("/{id}")
    public ResponseEntity<Item> updateItem(@PathVariable Long id, @RequestBody Item itemDetails) {
        Item updatedItem = itemService.updateItem(id, itemDetails);
        if (updatedItem != null) {
            return ResponseEntity.ok(updatedItem);
        }
        return ResponseEntity.notFound().build();
    }

    // Delete an item
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteItem(@PathVariable Long id) {
        boolean deleted = itemService.deleteItem(id);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", deleted);
        if (deleted) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    // Get recent items
    @GetMapping("/recent")
    public ResponseEntity<List<Item>> getRecentItems() {
        return ResponseEntity.ok(itemService.getRecentItems());
    }
}
