package petadoption.api.misc;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import petadoption.api.preferences.PreferenceService;
import petadoption.api.user.UserService;

/**
 * Just using this for testing.
 */

@CrossOrigin(origins = {"http://localhost:3000","http://35.224.27.57:3000"})
@RestController
public class ClearDataController {

    @Autowired
    private UserService userService;

    @Autowired
    private PreferenceService preferenceService;

    @PostMapping("/clear-table-users")
    public String clearUsers() {
        userService.clearData();
        return "User table emptied";
    }

     /* If you cant delete preferences table, you may have to delete the users table first
      * because of foreign key shenanigans
      * */
    @PostMapping("/clear-table-preferences")
    public String clearPreferences() {
        preferenceService.clearData();
        return "Preference table emptied";
    }
}
