package petadoption.api.grief;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import petadoption.api.annotation.GlobalCrossOrigin;

import java.util.List;

@RestController
@RequestMapping("/api")
@GlobalCrossOrigin
public class GriefController {

    @Autowired
    private GriefService griefService;

    // Fetch the current dislike count for the user
    @GetMapping("/grief/{userId}/dislikes")
    public ResponseEntity<Integer> getDislikeCount(@PathVariable Long userId) {
        Integer dislikeCount = griefService.getDislikeCount(userId);
        if (dislikeCount == null) {
            return ResponseEntity.noContent().build(); // Return 204 No Content if dislike count is null
        }
        return ResponseEntity.ok(dislikeCount);
    }

    // Increment the dislike count for the user
    @PostMapping("/grief/{userId}/dislike")
    public ResponseEntity<Void> incrementDislikeCount(@PathVariable Long userId) {
        griefService.incrementDislikeCount(userId);
        return ResponseEntity.ok().build();
    }

    // Decrement the dislike count for the user
    @PostMapping("/grief/{userId}/undislike")
    public ResponseEntity<Void> decrementDislikeCount(@PathVariable Long userId) {
        griefService.decrementDislikeCount(userId);
        return ResponseEntity.ok().build();
    }

    // Fetch the list of euthanized pet IDs for the user
    @GetMapping("/grief/{userId}/euthanizedPets")
    public ResponseEntity<List<Long>> getEuthanizedPetIds(@PathVariable Long userId) {
        List<Long> euthanizedPets = griefService.getEuthanizedPetIds(userId);
        return ResponseEntity.ok(euthanizedPets);
    }

    // Add a new euthanized pet ID to the user's list
    @PostMapping("/grief/{userId}/euthanizePet")
    public ResponseEntity<Void> updateEuthanizedPetIds(@PathVariable Long userId, @RequestParam Long petId) {
        griefService.updateEuthanizedPetIds(userId, petId);
        return ResponseEntity.ok().build();
    }

    // Remove a euthanized pet ID from the user's list
    @PostMapping("/grief/{userId}/unEuthanizePet")
    public ResponseEntity<Void> removeEuthanizedPetId(@PathVariable Long userId, @RequestParam Long petId) {
        griefService.removeEuthanizedPetId(userId, petId);
        return ResponseEntity.ok().build();
    }
}
