// GRIEF - Guilt-Ridden Interaction Engine for Fostering
package petadoption.api.grief;

import java.util.ArrayList;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.ArrayList;

/**
 * Entity representing grief data for a user in the pet adoption system.
 *
 * <p>This class stores information about the user's interactions, including the
 * number of dislikes, the number of euthanized pets, and their rank.
 */
@Data
@Entity
@Getter
@Setter
@EqualsAndHashCode()
public class Grief {

    /**
     * Unique identifier for the grief record.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The ID of the potential owner associated with this grief record.
     */
    @Column(name = "OWNER_ID")
    private Long potentialOwnerId;

    /**
     * The number of dislikes associated with the potential owner.
     */
    @Column(name = "NUM_DISLIKES")
    private Integer numDislikes = 0;

    /**
     * The count of euthanized pets associated with the potential owner.
     */
    @Column(name = "KILL_COUNT")
    private Integer killCount = 0;

    /**
     * The user's rank based on the number of euthanized pets.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "USER_RANK")
    private UserRank userRank;

    /**
     * A list of IDs of euthanized pets associated with the potential owner.
     */
    @ElementCollection
    @CollectionTable(name = "euthanized_pets", joinColumns = @JoinColumn(name = "grief_id"))
    @Column(name = "euthanized_pet_ids")
    private List<Long> euthanizedPets = new ArrayList<>();

    /**
     * Automatically updates the user's rank based on their kill count before saving or updating the entity.
     */
    @PrePersist
    @PreUpdate
    private void updateRank() {
        if (numDislikes != null) {
            this.userRank = UserRank.getRankByKillCount(killCount);
        }
    }
}
