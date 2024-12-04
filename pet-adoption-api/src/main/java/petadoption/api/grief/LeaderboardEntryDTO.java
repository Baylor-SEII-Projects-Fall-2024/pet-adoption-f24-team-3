package petadoption.api.grief;

import lombok.Data;

/**
 * Data Transfer Object (DTO) representing an entry on the leaderboard.
 * 
 * <p>This DTO is used to transfer a user's grief data for leaderboard purposes, 
 * including the user's ID, name, number of dislikes, and number of euthanized pets.
 */
@Data
public class LeaderboardEntryDTO {

    /**
     * The unique identifier of the potential owner associated with the grief data.
     */
    private Long potentialOwnerId;

    /**
     * The first name of the potential owner.
     */
    private String firstName;

    /**
     * The last name of the potential owner.
     */
    private String lastName;

    /**
     * The number of dislikes associated with the potential owner.
     */
    private Integer numDislikes;

    /**
     * The number of pets euthanized by the potential owner.
     */
    private Integer killCount;
}
