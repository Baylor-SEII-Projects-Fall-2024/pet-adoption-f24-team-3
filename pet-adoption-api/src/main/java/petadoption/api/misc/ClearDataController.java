package petadoption.api.misc;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import petadoption.api.preferences.PreferenceService;
import petadoption.api.user.UserService;
import petadoption.api.animal.AnimalService;
import petadoption.api.event.EventService;

/**
 * Just using this for testing.
 */

@CrossOrigin(origins = { "http://localhost:3000", "http://130.211.116.230:3000", "http://34.69.88.79:3000", "http://34.132.214.70:3000" })
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
}
