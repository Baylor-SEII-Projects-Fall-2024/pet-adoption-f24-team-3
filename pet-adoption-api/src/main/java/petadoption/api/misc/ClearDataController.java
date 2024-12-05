package petadoption.api.misc;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import petadoption.api.chat.ChatService;
import petadoption.api.chat.MessageService;
import petadoption.api.preferences.PreferenceService;
import petadoption.api.recommendations.RecommendationsService;
import petadoption.api.user.UserService;
import petadoption.api.animal.AnimalService;
import petadoption.api.event.EventService;
import petadoption.api.grief.GriefService;
import petadoption.api.annotation.GlobalCrossOrigin;

/**
 * Just using this for testing.
 */

@GlobalCrossOrigin
@RestController
public class ClearDataController {

    @Autowired
    private UserService userService;

    @Autowired
    private PreferenceService preferenceService;

    @Autowired
    private AnimalService animalService;

    @Autowired
    private EventService eventService;

    @Autowired
    private ChatService chatService;

    @Autowired
    private MessageService messageService;

    @Autowired
    private RecommendationsService recommendationsService;

    @Autowired
    private GriefService griefService;

    @PostMapping("/clear-table-users")
    public String clearUsers() {
        userService.clearData();
        return "User table emptied";
    }

    /*
     * If you cant delete preferences table, you may have to delete the 
     * users table first because of foreign key shenanigans
     */
    @PostMapping("/clear-table-preferences")
    public String clearPreferences() {
        preferenceService.clearData();
        return "Preference table emptied";
    }

    /**
     * See above
     * */
    @PostMapping("/clear-table-pets")
    public String clearPets() {
        animalService.clearData();
        return "Pets table emptied";
    }

    /**
     * See above
     * */
    @PostMapping("/clear-table-events")
    public String clearEvents() {
        eventService.clearData();
        return "Events table emptied";
    }

    @PostMapping("/clear-table-chats")
    public String clearChats() {
        chatService.clearData();
        return "Chats table emptied";
    }

    @PostMapping("/clear-table-messages")
    public String clearMessages() {
        messageService.clearData();
        return "Messages table emptied";
    }

    @PostMapping("/clear-table-interactions")
    public String clearInteractions() {
        recommendationsService.clearData();
        return "Interactions table emptied";
    }

    @PostMapping("/clear-grief")
    public String clearGrief() {
        griefService.clearData();
        return "Grief table emptied";
    }

    @PostMapping("/clear-all")
    public String clearAll() {
        userService.clearData();
        preferenceService.clearData();
        animalService.clearData();
        eventService.clearData();
        chatService.clearData();
        messageService.clearData();
        recommendationsService.clearData();
        griefService.clearData();
        return "All tables emptied";
    }
}
