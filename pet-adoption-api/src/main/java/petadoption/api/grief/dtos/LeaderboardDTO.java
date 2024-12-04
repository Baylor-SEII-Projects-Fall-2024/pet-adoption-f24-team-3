package petadoption.api.grief.dtos;

import lombok.Data;
import java.util.List;

/**
 * Data Transfer Object (DTO) representing the leaderboard for grief data.
 * 
 * <p>This DTO is used to transfer the entire leaderboard, including the sorting
 * criteria and a list of leaderboard entries representing users' grief data.
 */
@Data
public class LeaderboardDTO {

    /**
     * The criterion by which the leaderboard is sorted. Possible values include:
     * "kills", "dislikes", "ownerid", "firstname", "lastname".
     */
    private String sortedBy;

    /**
     * A list of leaderboard entries, each representing a user's grief data.
     */
    private List<LeaderboardEntryDTO> entries;
}