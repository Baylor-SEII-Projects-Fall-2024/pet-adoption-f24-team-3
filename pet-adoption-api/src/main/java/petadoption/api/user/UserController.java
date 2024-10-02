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
    public ResponseEntity<Map<String, String>> saveAdoptionCenter(@RequestBody CenterDto centerDto) {
        boolean isRegistered = userService.registerCenter(centerDto);
        Map<String, String> response = new HashMap<>();

        if (isRegistered) {
            response.put("message", "Center registered successfully!");
            return ResponseEntity.ok(response); // Return success message as JSON
        } else {
            response.put("message", "Registration failed.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response); // Return error message as JSON
        }
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/owners")
    public ResponseEntity<Map<String, String>> savePotentialOwner(@RequestBody OwnerDto ownerDto) {
        boolean isRegistered = userService.registerOwner(ownerDto);
        Map<String, String> response = new HashMap<>();

        if (isRegistered) {
            response.put("message", "Owner registered successfully!");
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
