package com.campus.lostandfound.service;

import com.campus.lostandfound.model.Item;
import com.campus.lostandfound.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ItemService {

    @Autowired
    private ItemRepository itemRepository;

    public Item createItem(Item item) {
        return itemRepository.save(item);
    }

    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    public Optional<Item> getItemById(Long id) {
        return itemRepository.findById(id);
    }

    public List<Item> getItemsByStatus(String status) {
        return itemRepository.findByStatus(status);
    }

    public List<Item> getItemsByCategory(String category) {
        return itemRepository.findByCategory(category);
    }

    public List<Item> searchItems(String keyword) {
        return itemRepository.searchByKeyword(keyword);
    }

    public List<Item> filterItems(String status, String category, String keyword) {
        if (keyword != null && !keyword.isEmpty() && status != null && !status.isEmpty()) {
            return itemRepository.searchByStatusAndKeyword(status, keyword);
        } else if (status != null && !status.isEmpty() && category != null && !category.isEmpty()) {
            return itemRepository.findByStatusAndCategory(status, category);
        } else if (status != null && !status.isEmpty()) {
            return itemRepository.findByStatus(status);
        } else if (category != null && !category.isEmpty()) {
            return itemRepository.findByCategory(category);
        } else if (keyword != null && !keyword.isEmpty()) {
            return itemRepository.searchByKeyword(keyword);
        }
        return itemRepository.findAll();
    }

    public Item updateItem(Long id, Item itemDetails) {
        Optional<Item> optionalItem = itemRepository.findById(id);
        if (optionalItem.isPresent()) {
            Item item = optionalItem.get();
            if (itemDetails.getTitle() != null) item.setTitle(itemDetails.getTitle());
            if (itemDetails.getDescription() != null) item.setDescription(itemDetails.getDescription());
            if (itemDetails.getCategory() != null) item.setCategory(itemDetails.getCategory());
            if (itemDetails.getLocation() != null) item.setLocation(itemDetails.getLocation());
            if (itemDetails.getStatus() != null) item.setStatus(itemDetails.getStatus());
            if (itemDetails.getReporterName() != null) item.setReporterName(itemDetails.getReporterName());
            if (itemDetails.getReporterEmail() != null) item.setReporterEmail(itemDetails.getReporterEmail());
            if (itemDetails.getContactPhone() != null) item.setContactPhone(itemDetails.getContactPhone());
            if (itemDetails.getImageUrl() != null) item.setImageUrl(itemDetails.getImageUrl());
            return itemRepository.save(item);
        }
        return null;
    }

    public boolean deleteItem(Long id) {
        if (itemRepository.existsById(id)) {
            itemRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public long countByStatus(String status) {
        return itemRepository.countByStatus(status);
    }

    public List<Item> getRecentItems() {
        return itemRepository.findTop10ByOrderByDateReportedDesc();
    }
}
