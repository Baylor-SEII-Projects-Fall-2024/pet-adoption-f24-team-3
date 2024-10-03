package petadoption.api.user;


import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.user.dtos.CenterDto;
import petadoption.api.user.dtos.LoginDto;
import petadoption.api.user.dtos.OwnerDto;
import petadoption.api.user.dtos.UserDto;
import petadoption.api.user.responseObjects.SessionUserDataResponse;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Log4j2
@RestController
@RequestMapping("/api")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/users")
    public List<User> findAllUsers() {
        return userService.findAllUsers();
    }

    //will return all info regardless of type
    @GetMapping("/users/{id}")
    public User findUserById(@PathVariable Long id) {
        var user = userService.findUser(id).orElse(null);
        if (user == null) {
            log.warn("User not found");
        }
        return user;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/users/{id}/sessionData")
    public SessionUserDataResponse getUserSessionData(@PathVariable Long id) {
        var user = userService.findUser(id).orElse(null);

        if (user == null) {
            log.warn("User not found");
            return null;
        }

        SessionUserDataResponse sessionUser = new SessionUserDataResponse();
        sessionUser.userId = user.getId();
        sessionUser.accountType=user.getAccountType();
        sessionUser.profilePicPath=user.getProfilePicPath();
        if(user instanceof  PotentialOwner){
            sessionUser.userFullName=((PotentialOwner) user).nameFirst + " " + ((PotentialOwner) user).nameLast;
        }
        else if(user instanceof  AdoptionCenter){
            sessionUser.userFullName=((AdoptionCenter) user).getName();
        }

        return sessionUser;
    }

    @GetMapping("users/{email}")
    public User findUserByEmail(@PathVariable String email) {
        var user = userService.findUserByEmail(email).orElse(null);
        if (user == null) {
            log.warn("No user found for {}", email);
        }
        return user;
    }

    //restrict search to owners
    @GetMapping("/owners/{id}")
    public PotentialOwner findPotentialOwnerById(@PathVariable Long id) {
        var potentialOwner = userService.findPotentialOwner(id).orElse(null);
        if (potentialOwner == null) {
            log.warn("Potential Owner not found");
        }
        return potentialOwner;
    }

    //restrict search to centers
    @GetMapping("/centers/{id}")
    public AdoptionCenter findCenterById(@PathVariable Long id) {
        var center = userService.findAdoptionCenter(id).orElse(null);
        if (center == null) {
            log.warn("Adoption Center not found");
        }
        return center;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/centers")
    public ResponseEntity<Map<String, Object>> saveAdoptionCenter(@RequestBody CenterDto centerDto) {
        Long newUserId = userService.registerCenter(centerDto);
        Map<String, Object>  response = new HashMap<>();

        if (newUserId!=null) {
            response.put("userid", newUserId);
            return ResponseEntity.ok(response); // Return success message as JSON
        } else {
            response.put("message", "Registration failed.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response); // Return error message as JSON
        }
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/owners")
    public ResponseEntity<Map<String, Object>> savePotentialOwner(@RequestBody OwnerDto ownerDto) {
        Long newOwnerId = userService.registerOwner(ownerDto);
        Map<String, Object> response = new HashMap<>();

        if (newOwnerId != null) {
            response.put("userid",newOwnerId);
            return ResponseEntity.ok(response); // Return success message as JSON
        } else {
            response.put("message", "Registration failed.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response); // Return error message as JSON
        }
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/login")
    public ResponseEntity<Map<String, Long>> loginUser(@RequestBody LoginDto loginDto) {
        Map<String, Long> response = new HashMap<>();
        long uid = userService.loginUser(loginDto);
        if(uid > 0){
            response.put("userid", uid);
            return ResponseEntity.ok(response);
        }else {
            response.put("message", -1L);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

}
