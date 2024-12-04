package petadoption.api.grief;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import petadoption.api.annotation.GlobalCrossOrigin;

import java.util.List;

/**
 * REST Controller for managing grief-related operations such as dislikes, euthanized pets, 
 * and leaderboard for the Pet Adoption application.
 */
@RestController
@RequestMapping("/api/grief")
@GlobalCrossOrigin
public class GriefController {

    /**
     * Service layer for handling grief-related operations.
     */
    @Autowired
    private GriefService griefService;

    /**
     * Retrieves detailed grief information for a specific user.
     *
     * <p>
     * This endpoint provides information about the user's grief statistics,
     * including:
     * <ul>
     * <li>The number of dislikes the user has received.</li>
     * <li>The kill count (number of pets euthanized) associated with the user.</li>
     * <li>The user's current rank, including the rank title and descriptive
     * message.</li>
     * </ul>
     *
     * @param userId the unique identifier of the user for whom grief details are
     *               being retrieved.
     * @return a {@link ResponseEntity} containing a {@link UserGriefDTO} object
     *         with the user's grief details.
     *         The response includes the user's ID, dislikes, kill count, rank, rank
     *         title, and rank message.
     */
    @GetMapping("/{userId}/details")
    public ResponseEntity<UserGriefDTO> getUserDetails(@PathVariable Long userId) {
        UserGriefDTO griefDetails = griefService.getGriefDetails(userId);
        return ResponseEntity.ok(griefDetails);
    }

    /**
     * Retrieves the current dislike count for the specified user.
     *
     * @param userId the ID of the user
     * @return ResponseEntity containing the dislike count or 204 No Content if the count is null
     */
    @GetMapping("/{userId}/dislikes")
    public ResponseEntity<Integer> getDislikeCount(@PathVariable Long userId) {
        Integer dislikeCount = griefService.getDislikeCount(userId);
        if (dislikeCount == null) {
            return ResponseEntity.noContent().build(); // Return 204 No Content if dislike count is null
        }
        return ResponseEntity.ok(dislikeCount);
    }

    /**
     * Increments the dislike count for the specified user.
     *
     * @param userId the ID of the user
     * @return ResponseEntity with HTTP status 200 OK
     */
    @PostMapping("/{userId}/dislike")
    public ResponseEntity<Void> incrementDislikeCount(@PathVariable Long userId) {
        griefService.incrementDislikeCount(userId);
        return ResponseEntity.ok().build();
    }

    /**
     * Decrements the dislike count for the specified user.
     *
     * @param userId the ID of the user
     * @return ResponseEntity with HTTP status 200 OK
     */
    @PostMapping("/{userId}/undislike")
    public ResponseEntity<Void> decrementDislikeCount(@PathVariable Long userId) {
        griefService.decrementDislikeCount(userId);
        return ResponseEntity.ok().build();
    }

    /**
     * Retrieves the number of pets euthanized by the specified user.
     *
     * @param userId the ID of the user
     * @return the number of euthanized pets
     */
    @GetMapping("/{userId}/killcount")
    public Integer getKillCount(@PathVariable Long userId) {
        return griefService.getKillCount(userId);
    }

    /**
     * Retrieves the list of IDs of pets euthanized by the specified user.
     *
     * @param userId the ID of the user
     * @return ResponseEntity containing a list of euthanized pet IDs
     */
    @GetMapping("/{userId}/euthanizedPets")
    public ResponseEntity<List<Long>> getEuthanizedPetIds(@PathVariable Long userId) {
        List<Long> euthanizedPets = griefService.getEuthanizedPetIds(userId);
        return ResponseEntity.ok(euthanizedPets);
    }

    /**
     * Adds a new pet to the list of euthanized pets for the specified user.
     * This operation also increments the euthanized pet count.
     *
     * @param userId the ID of the user
     * @param petId  the ID of the pet to add
     * @return ResponseEntity with HTTP status 200 OK
     */
    @PostMapping("/{userId}/euthanizePet")
    public ResponseEntity<Void> updateEuthanizedPetIds(@PathVariable Long userId, @RequestParam Long petId) {
        griefService.updateEuthanizedPetIds(userId, petId);
        return ResponseEntity.ok().build();
    }

    /**
     * Retrieves the leaderboard of users based on specified sorting criteria.
     *
     * <p>
     * The leaderboard can be sorted using the following options:
     * <ul>
     * <li><b>kills</b> (default): Sorts the leaderboard by the number of pets
     * euthanized, in descending order.</li>
     * <li><b>dislikes</b>: Sorts the leaderboard by the number of dislikes, in
     * descending order.</li>
     * <li><b>ownerid</b>: Sorts the leaderboard by the user ID (owner ID), in
     * ascending order.</li>
     * <li><b>firstname</b>: Sorts the leaderboard alphabetically by the first name
     * of the user.</li>
     * <li><b>lastname</b>: Sorts the leaderboard alphabetically by the last name of
     * the user.</li>
     * </ul>
     *
     * @param sortBy the sorting criterion; defaults to "kills" if not provided.
     * @return a {@link LeaderboardDTO} object containing the leaderboard entries
     *         and the sorting criteria.
     */
    @GetMapping("/leaderboard")
    public ResponseEntity<LeaderboardDTO> getLeaderboard(
            @RequestParam(required = false, defaultValue = "kills") String sortBy) {
        List<LeaderboardEntryDTO> leaderboardEntries = griefService.getLeaderboard(sortBy);
        LeaderboardDTO leaderboardDTO = new LeaderboardDTO();
        leaderboardDTO.setSortedBy(sortBy);
        leaderboardDTO.setEntries(leaderboardEntries);
        return ResponseEntity.ok(leaderboardDTO);
    }
}
