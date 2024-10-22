package petadoption.api.misc;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import petadoption.api.user.UserService;

/**
 * Just using this for testing.
 */

@CrossOrigin(origins = {"http://localhost:3000","http://35.224.27.57:3000"})
@RestController
public class ClearDataController {

    @Autowired
    private UserService userService;

    @PostMapping("/clear-table-users")
    public String clearTable() {
        userService.clearData();
        return "User table emptied";
    }
}