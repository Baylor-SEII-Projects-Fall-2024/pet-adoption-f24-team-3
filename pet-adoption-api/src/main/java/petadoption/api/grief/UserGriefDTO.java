package petadoption.api.grief;

import lombok.Data;

/**
 * Data Transfer Object (DTO) for representing grief-related information of a user.
 * 
 * <p>This DTO is used to transfer information about a user's grief data, including
 * the number of dislikes, the number of euthanized pets, the user's rank, and 
 * rank-specific messages.
 */
@Data
public class UserGriefDTO {

    /**
     * The unique identifier of the potential owner associated with the grief data.
     */
    private Long potentialOwnerId;

    /**
     * The number of dislikes associated with the potential owner.
     */
    private Integer numDislikes;

    /**
     * The number of pets euthanized by the potential owner.
     */
    private Integer killCount;

    /**
     * The user's rank based on the number of euthanized pets.
     */
    private UserRank userRank;

    /**
     * The title of the user's rank.
     */
    private String rankTitle;

    /**
     * A descriptive message associated with the user's rank.
     */
    private String rankMessage;
}
