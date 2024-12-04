package petadoption.api.grief;

/**
 * Enum representing the user's rank based on their grief-related activities.
 * 
 * <p>The rank is determined by the number of euthanized pets (kills) associated with a user. 
 * Each rank has a corresponding title and message, which are provided for display purposes.
 */
public enum UserRank {

    /**
     * The "Burgeoning Sociopath" rank for users with a low number of euthanized pets.
     * The message for this rank is "So you feel good about yourself?".
     */
    BURGEONING_SOCIOPATH("Burgeoning Sociopath", "So you feel good about yourself?"),

    /**
     * The "Adept Sociopath" rank for users with a moderate number of euthanized pets.
     * The message for this rank is "Look at how many you've sentenced to death.".
     */
    ADEPT_SOCIOPATH("Adept Sociopath", "Look at how many you've sentenced to death."),

    /**
     * The "Master Sociopath" rank for users with a higher number of euthanized pets.
     * The message for this rank is "Do you even care about their lives?".
     */
    MASTER_SOCIOPATH("Master Sociopath", "Do you even care about their lives?"),

    /**
     * The "Supreme Sociopath" rank for users with a very high number of euthanized pets.
     * The message for this rank is "Congratulations! You've made quite an impact!".
     */
    SUPREME_SOCIOPATH("Supreme Sociopath", "Congratulations! You've made quite an impact!");

    /**
     * The title associated with the rank.
     */
    private final String title;

    /**
     * The message associated with the rank.
     */
    private final String message;

    /**
     * Constructs a new rank with the specified title and message.
     *
     * @param title the title of the rank
     * @param message the message for the rank
     */
    UserRank(String title, String message) {
        this.title = title;
        this.message = message;
    }

    /**
     * Retrieves the title of the rank.
     *
     * @return the title of the rank
     */
    public String getTitle() {
        return title;
    }

    /**
     * Retrieves the message of the rank.
     *
     * @return the message of the rank
     */
    public String getMessage() {
        return message;
    }

    /**
     * Determines the rank based on the number of kills (euthanized pets).
     *
     * @param killCount the number of kills (euthanized pets) associated with a user
     * @return the appropriate UserRank based on the kill count
     */
    public static UserRank getRankByKillCount(int killCount) {
        if (killCount > 10) {
            return SUPREME_SOCIOPATH;
        } else if (killCount > 5) {
            return MASTER_SOCIOPATH;
        } else if (killCount > 2) {
            return ADEPT_SOCIOPATH;
        } else {
            return BURGEONING_SOCIOPATH;
        }
    }
}
