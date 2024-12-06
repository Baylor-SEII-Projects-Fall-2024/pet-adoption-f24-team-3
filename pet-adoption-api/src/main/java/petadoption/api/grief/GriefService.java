package petadoption.api.grief;

import petadoption.api.user.PotentialOwnerRepository;

import lombok.extern.log4j.Log4j2;
import petadoption.api.grief.dtos.LeaderboardEntryDTO;
import petadoption.api.grief.dtos.UserGriefDTO;
import petadoption.api.user.PotentialOwner;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.Comparator;

/**
 * Service for managing user grief-related operations, including tracking dislikes,
 * euthanized pets, and generating leaderboard statistics.
 */
@Log4j2
@Service
public class GriefService {

    @Autowired
    private GriefRepository griefRepository;

    @Autowired
    private PotentialOwnerRepository potentialOwnerRepository;

    /**
     * Retrieves detailed grief statistics for a specific user.
     *
     * @param userId the unique identifier of the user.
     * @return a {@link UserGriefDTO} containing the user's grief statistics, rank,
     *         title, and message.
     * @throws EntityNotFoundException if no grief record is found for the specified user ID.
     */
    public UserGriefDTO getGriefDetails(Long userId) {
        Grief grief = griefRepository.findByPotentialOwnerId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Grief not found for user ID: " + userId));

        UserGriefDTO dto = new UserGriefDTO();
        dto.setPotentialOwnerId(grief.getPotentialOwnerId());
        dto.setNumDislikes(grief.getNumDislikes());
        dto.setKillCount(grief.getKillCount());
        dto.setUserRank(grief.getUserRank());
        dto.setRankTitle(grief.getUserRank().getTitle());
        dto.setRankMessage(grief.getUserRank().getMessage());

        return dto;
    }

    /**
     * Retrieves the number of dislikes for a specific user.
     *
     * @param potentialOwnerId the unique identifier of the user.
     * @return the number of dislikes the user has received, or 0 if no record exists.
     */
    public Integer getDislikeCount(Long potentialOwnerId) {
        Optional<Grief> grief = griefRepository.findByPotentialOwnerId(potentialOwnerId);
        if (grief.isPresent()) {
            return grief.get().getNumDislikes();
        } else {
            return 0;  // If the user doesn't have a Grief record, return 0
        }
    }

    /**
     * Increments the dislike count for a specific user.
     *
     * @param potentialOwnerId the unique identifier of the user.
     */
    public void incrementDislikeCount(Long potentialOwnerId) {
        Optional<Grief> grief = griefRepository.findByPotentialOwnerId(potentialOwnerId);
        if (grief.isPresent()) {
            grief.get().setNumDislikes(grief.get().getNumDislikes() + 1);
            griefRepository.save(grief.get());
        } else {
            // If there's no Grief entry for the user, create a new one
            Grief newGrief = new Grief();
            newGrief.setPotentialOwnerId(potentialOwnerId);
            newGrief.setNumDislikes(1);
            griefRepository.save(newGrief);
        }
    }

    /**
     * Decrements the dislike count for a specific user if the count is greater than zero.
     *
     * @param potentialOwnerId the unique identifier of the user.
     */
    public void decrementDislikeCount(Long potentialOwnerId) {
        Optional<Grief> grief = griefRepository.findByPotentialOwnerId(potentialOwnerId);
        if (grief.isPresent()) {
            int numDislikes = grief.get().getNumDislikes();
            if (numDislikes > 0) {
                grief.get().setNumDislikes(numDislikes - 1);
                griefRepository.save(grief.get());
            }
        }
    }

    /**
     * Retrieves the list of euthanized pet IDs associated with a specific user.
     *
     * @param potentialOwnerId the unique identifier of the user.
     * @return a list of euthanized pet IDs, or an empty list if no record exists.
     */
    public List<Long> getEuthanizedPetIds(Long potentialOwnerId) {
        Optional<Grief> grief = griefRepository.findByPotentialOwnerId(potentialOwnerId);
        return grief.map(Grief::getEuthanizedPets).orElse(List.of());
    }

    /**
     * Adds a pet ID to the euthanized pets list for a specific user and increments the kill count.
     *
     * @param potentialOwnerId the unique identifier of the user.
     * @param petId            the unique identifier of the pet to be added.
     */
    public void updateEuthanizedPetIds(Long potentialOwnerId, Long petId) {
        Optional<Grief> grief = griefRepository.findByPotentialOwnerId(potentialOwnerId);
        if (grief.isPresent()) {
            Grief griefRecord = grief.get();
            List<Long> euthanizedPets = griefRecord.getEuthanizedPets();

            // Ensure killCount is not null
            if (griefRecord.getKillCount() == null) {
                griefRecord.setKillCount(0);
            }

            if (!euthanizedPets.contains(petId)) {
                euthanizedPets.add(petId);
                griefRecord.setEuthanizedPets(euthanizedPets);
                griefRecord.setKillCount(griefRecord.getKillCount() + 1);
                griefRepository.save(griefRecord);
            }
        } else {
            // If there's no Grief entry for the user, create a new one
            // with the euthanized pet
            Grief newGrief = new Grief();
            newGrief.setPotentialOwnerId(potentialOwnerId);
            newGrief.setEuthanizedPets(new ArrayList<>(List.of(petId)));
            newGrief.setKillCount(1); // Initialize kill count
            griefRepository.save(newGrief);
        }
    }

    /**
     * Retrieves the total kill count (number of euthanized pets) for a specific user.
     *
     * @param potentialOwnerId the unique identifier of the user.
     * @return the kill count, or 0 if no record exists.
     */
    public Integer getKillCount(Long potentialOwnerId) {
        Optional<Grief> grief = griefRepository.findByPotentialOwnerId(potentialOwnerId);
        return grief.map(Grief::getKillCount).orElse(0);
        // return grief.map(g -> g.getEuthanizedPets().size()).orElse(0);
    }

    /**
     * Generates a leaderboard of users based on the specified sorting criterion.
     *
     * <p>Sorting options:
     * <ul>
     *     <li><b>kills</b> (default): Sorts by the number of pets euthanized in descending order.</li>
     *     <li><b>dislikes</b>: Sorts by the number of dislikes in descending order.</li>
     * </ul>
     *
     * @param sortBy the sorting criterion; defaults to "kills" if not specified.
     * @return a list of {@link LeaderboardEntryDTO} representing the leaderboard entries.
     */
    public List<LeaderboardEntryDTO> getLeaderboard(String sortBy, Integer count) {
        List<Grief> allGriefs = griefRepository.findAll();

        // Filter out entries with a kill count < 1
        List<Grief> filteredGriefs = allGriefs.stream()
                .filter(grief -> grief.getKillCount() > 0)
                .collect(Collectors.toList());

        // Sort based on the `sortBy` parameter
        switch (sortBy.toLowerCase()) {
            case "kills":
                filteredGriefs.sort(Comparator.comparing(Grief::getKillCount)
                    .thenComparing(Grief::getNumDislikes).reversed());
                break;
            case "dislikes":
                filteredGriefs.sort(Comparator.comparing(Grief::getNumDislikes)
                    .thenComparing(Grief::getKillCount).reversed());
                break;
            default:
                break; // Optionally handle invalid sort criteria
        }

        // Limit entries returned to at most `count`
        List<Grief> limitedGriefs = filteredGriefs.stream().limit(count).collect(Collectors.toList());

        // Assign ranks and create DTOs for leaderboard entries
        List<LeaderboardEntryDTO> leaderboard = new ArrayList<>();
        int rank = 1;

        for (int i = 0; i < limitedGriefs.size(); i++) {
            Grief grief = limitedGriefs.get(i);
            LeaderboardEntryDTO dto = new LeaderboardEntryDTO();

            if (i > 0 && isEqualForRanking(limitedGriefs.get(i), limitedGriefs.get(i - 1))) {
                // If the current entry has the same sort values as the previous, it gets the same rank
                dto.setRank(rank);
            } else {
                // Otherwise, assign a new rank
                dto.setRank(rank);
                rank++;
            }

            dto.setPotentialOwnerId(grief.getPotentialOwnerId());
            dto.setNumDislikes(grief.getNumDislikes());
            dto.setKillCount(grief.getKillCount());
            dto.setUserTitle(grief.getUserRank().getTitle());

            // Fetch owner details if available
            potentialOwnerRepository.findById(grief.getPotentialOwnerId()).ifPresent(owner -> {
                dto.setFirstName(owner.getNameFirst());
                dto.setLastName(owner.getNameLast());
            });

            leaderboard.add(dto);
        }

        return leaderboard;
    }

    // Helper method to check if two Grief entries have the same sorting criteria
    private boolean isEqualForRanking(Grief grief1, Grief grief2) {
        return grief1.getKillCount().equals(grief2.getKillCount()) &&
           grief1.getNumDislikes().equals(grief2.getNumDislikes());
    }

    /**
     * Sets the kill count for a specific user.
     *
     * This method is used for data generation purposes and should not be used in production.
     *
     * @param userId the ID of the user
     * @param killCount the number of pets euthanized by the user
     */
    public void setKillCount(Long userId, Integer killCount) {
        Optional<Grief> grief = griefRepository.findByPotentialOwnerId(userId);
        if (grief.isPresent()) {
            grief.get().setKillCount(killCount);
            griefRepository.save(grief.get());
        } else {
            Grief newGrief = new Grief();
            newGrief.setPotentialOwnerId(userId);
            newGrief.setKillCount(killCount);
            griefRepository.save(newGrief);
        }
    }

    /**
     * Sets the dislike count for a specific user.
     *
     * This method is used for data generation purposes and should not be used in production.
     *
     * @param userId the ID of the user
     * @param dislikeCount the number of dislikes received by the user
     */
    public void setDislikeCount(Long userId, Integer dislikeCount) {
        Optional<Grief> grief = griefRepository.findByPotentialOwnerId(userId);
        if (grief.isPresent()) {
            grief.get().setNumDislikes(dislikeCount);
            griefRepository.save(grief.get());
        } else {
            Grief newGrief = new Grief();
            newGrief.setPotentialOwnerId(userId);
            newGrief.setNumDislikes(dislikeCount);
            griefRepository.save(newGrief);
        }
    }

    /**
     * Clears all grief data from the system.
     *
     * This is just used in development and testing environments and should not be used in production.
     *
     * @see ClearDataController#deleteAll()
     */
    public void clearData() {
        griefRepository.deleteAll();
    }
}
