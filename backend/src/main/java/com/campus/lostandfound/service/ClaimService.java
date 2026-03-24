package com.campus.lostandfound.service;

import com.campus.lostandfound.model.Claim;
import com.campus.lostandfound.model.Item;
import com.campus.lostandfound.repository.ClaimRepository;
import com.campus.lostandfound.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClaimService {

    @Autowired
    private ClaimRepository claimRepository;

    @Autowired
    private ItemRepository itemRepository;

    public Claim createClaim(Claim claim) {
        return claimRepository.save(claim);
    }

    public List<Claim> getClaimsByItemId(Long itemId) {
        return claimRepository.findByItemId(itemId);
    }

    public Claim approveClaim(Long claimId) {
        Optional<Claim> optionalClaim = claimRepository.findById(claimId);
        if (optionalClaim.isPresent()) {
            Claim claim = optionalClaim.get();
            claim.setStatus("APPROVED");
            claimRepository.save(claim);

            // Update item status to CLAIMED
            Optional<Item> optionalItem = itemRepository.findById(claim.getItemId());
            if (optionalItem.isPresent()) {
                Item item = optionalItem.get();
                item.setStatus("CLAIMED");
                itemRepository.save(item);
            }

            // Reject all other pending claims for this item
            List<Claim> otherClaims = claimRepository.findByItemId(claim.getItemId());
            for (Claim other : otherClaims) {
                if (!other.getId().equals(claimId) && "PENDING".equals(other.getStatus())) {
                    other.setStatus("REJECTED");
                    claimRepository.save(other);
                }
            }

            return claim;
        }
        return null;
    }

    public Claim rejectClaim(Long claimId) {
        Optional<Claim> optionalClaim = claimRepository.findById(claimId);
        if (optionalClaim.isPresent()) {
            Claim claim = optionalClaim.get();
            claim.setStatus("REJECTED");
            return claimRepository.save(claim);
        }
        return null;
    }
}
