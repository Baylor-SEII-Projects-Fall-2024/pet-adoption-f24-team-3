package petadoption.api.user;


import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.user.dtos.LoginDto;
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
    public AdoptionCenter saveAdoptionCenter(@RequestBody AdoptionCenter center) {
        return (AdoptionCenter) userService.saveUser(center);
    }
    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/owners")
    public PotentialOwner savePotentialOwner(@RequestBody PotentialOwner owner) {
        return (PotentialOwner) userService.saveUser(owner);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> registerUser(@RequestBody UserDto userDto) {
        boolean isRegistered = userService.registerUser(userDto);
//        return isRegistered
//                ? ResponseEntity.ok("User registered successfully!")
//                : ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Registration failed.");
        Map<String, String> response = new HashMap<>();

        if (isRegistered) {
            response.put("message", "User registered successfully!");
            return ResponseEntity.ok(response); // Return success message as JSON
        } else {
            response.put("message", "Registration failed.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response); // Return error message as JSON
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody LoginDto loginDto) {
        boolean isAuthenticated = userService.loginUser(loginDto);
        return isAuthenticated
                ? ResponseEntity.ok("Login successful!")
                : ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials.");
    }

}
