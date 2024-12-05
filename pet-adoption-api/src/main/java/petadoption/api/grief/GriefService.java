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
     *     <li><b>firstname</b>: Sorts alphabetically by the user's first name.</li>
     *     <li><b>lastname</b>: Sorts alphabetically by the user's last name.</li>
     * </ul>
     *
     * @param sortBy the sorting criterion; defaults to "kills" if not specified.
     * @return a list of {@link LeaderboardEntryDTO} representing the leaderboard entries.
     */
    public List<LeaderboardEntryDTO> getLeaderboard(String sortBy, Integer count) {
        List<Grief> allGriefs = griefRepository.findAll();

        // Sort based on the `sortBy` parameter
        switch (sortBy.toLowerCase()) {
            case "kills":
                allGriefs.sort(Comparator.comparing(Grief::getKillCount).reversed());
                break;
            case "dislikes":
                allGriefs.sort(Comparator.comparing(Grief::getNumDislikes).reversed());
                break;
            case "firstname":
                allGriefs.sort(
                        Comparator.comparing(grief -> potentialOwnerRepository.findById(grief.getPotentialOwnerId())
                                .map(PotentialOwner::getNameFirst)
                                .orElse("")));
                break;
            case "lastname":
                allGriefs.sort(
                        Comparator.comparing(grief -> potentialOwnerRepository.findById(grief.getPotentialOwnerId())
                                .map(PotentialOwner::getNameLast)
                                .orElse("")));
                break;
            default:
                break; // Optionally handle invalid sort criteria
        }

        // Limit entries returned to at most `count`
        List<Grief> limitedGriefs = allGriefs.stream().limit(count).collect(Collectors.toList());

        // Convert Grief entities to GriefDTO
        return limitedGriefs.stream()
                .map(grief -> {
                    LeaderboardEntryDTO dto = new LeaderboardEntryDTO();
                    dto.setPotentialOwnerId(grief.getPotentialOwnerId());
                    dto.setNumDislikes(grief.getNumDislikes());
                    dto.setKillCount(grief.getKillCount());
                    dto.setUserRank(grief.getUserRank().getTitle());

                    // Fetch owner details if available
                    potentialOwnerRepository.findById(grief.getPotentialOwnerId()).ifPresent(owner -> {
                        dto.setFirstName(owner.getNameFirst());
                        dto.setLastName(owner.getNameLast());
                    });
                    return dto;
                })
                .collect(Collectors.toList());
    }
}
