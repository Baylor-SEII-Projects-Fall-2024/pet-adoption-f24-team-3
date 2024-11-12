package petadoption.api.user;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.user.dtos.CenterDto;
import petadoption.api.user.dtos.LoginDto;
import petadoption.api.user.dtos.OwnerDto;
import petadoption.api.user.responseObjects.AdoptionCenterCardResponse;
import petadoption.api.user.responseObjects.GenericUserDataResponse;
import petadoption.api.user.responseObjects.SessionUserDataResponse;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Log4j2
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = { "http://localhost:3000", "http://130.211.116.230:3000", "http://34.69.88.79:3000","http://35.224.27.57:3000" })
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/users")
    public List<User> findAllUsers() {
        return userService.findAllUsers();
    }

    @GetMapping("/users/")
    public User findUserById(@RequestParam Long id) {
        var user = userService.findUser(id).orElse(null);
        if (user == null) {
            log.warn("User not found");
        }
        return user;
    }

    @GetMapping("/users/{id}/sessionData")
    public SessionUserDataResponse getUserSessionData(@PathVariable Long id) {
        var user = userService.findUser(id).orElse(null);

        if (user == null) {
            log.warn("User not found");
            return null;
        }

        SessionUserDataResponse sessionUser = new SessionUserDataResponse();
        sessionUser.userId = user.getId();
        sessionUser.accountType = user.getAccountType();
        sessionUser.profilePicPath = user.getProfilePicPath();
        if (user instanceof PotentialOwner) {
            sessionUser.userFullName = ((PotentialOwner) user).nameFirst + " " + ((PotentialOwner) user).nameLast;
        } else if (user instanceof AdoptionCenter) {
            sessionUser.userFullName = ((AdoptionCenter) user).getName();
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

    // restrict search to owners
    @GetMapping("/owners/{id}")
    public PotentialOwner findPotentialOwnerById(@PathVariable Long id) {
        var potentialOwner = userService.findPotentialOwner(id).orElse(null);
        if (potentialOwner == null) {
            log.warn("Potential Owner not found");
        }
        return potentialOwner;
    }

    // restrict search to centers
    @GetMapping("/centers/{id}")
    public AdoptionCenter findCenterById(@PathVariable Long id) {
        var center = userService.findAdoptionCenter(id).orElse(null);
        if (center == null) {
            log.warn("Adoption Center not found");
        }
        return center;
    }

    @GetMapping("/users/{id}/generic")
    public ResponseEntity<GenericUserDataResponse> findUserGeneric(@PathVariable Long id){
        User user = userService.findUser(id).orElse(null);
        if(user==null){
            return new ResponseEntity<>(null,HttpStatus.BAD_REQUEST);
        }
        GenericUserDataResponse response = new GenericUserDataResponse();
        response.id = user.getId();
        response.emailAddress= user.getEmailAddress();
        response.accountType = user.getAccountType();
        if(user instanceof PotentialOwner){
            PotentialOwner owner = (PotentialOwner) user;
            response.name = owner.getNameFirst() + " " + owner.getNameLast();
        }
        else if(user instanceof  AdoptionCenter){
            AdoptionCenter center = (AdoptionCenter) user;
            response.name = center.getName();
        }
        return new ResponseEntity<>(response,HttpStatus.OK);
    }

    @GetMapping("/centers/paginated")
    public List<AdoptionCenterCardResponse> findCentersByPage(@RequestParam("pageSize") Integer pageSize,
            @RequestParam("pageNumber") Integer pageNumber) {
        List<AdoptionCenter> centers = userService.paginateCenters(pageSize, pageNumber);
        return centers.stream().map(AdoptionCenterCardResponse::new).collect(Collectors.toList());
    }

    @PostMapping("/centers")
    public ResponseEntity<Map<String, Object>> saveAdoptionCenter(@RequestBody CenterDto centerDto) {
        Long newUserId = userService.registerCenter(centerDto);
        Map<String, Object> response = new HashMap<>();

        if (newUserId != null) {
            response.put("userid", newUserId);
            return ResponseEntity.ok(response); // Return success message as JSON
        } else {
            response.put("message", "Registration failed.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response); // Return error message as
                                                                                           // JSON
        }
    }

    @PostMapping("/owners")
    public ResponseEntity<Map<String, Object>> savePotentialOwner(@RequestBody OwnerDto ownerDto) {
        Long newOwnerId = userService.registerOwner(ownerDto);
        Map<String, Object> response = new HashMap<>();

        if (newOwnerId != null) {
            response.put("userid", newOwnerId);
            return ResponseEntity.ok(response); // Return success message as JSON
        } else {
            response.put("message", "Registration failed.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response); // Return error message as
                                                                                           // JSON
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Long>> loginUser(@RequestBody LoginDto loginDto) {
        Map<String, Long> response = new HashMap<>();
        long uid = userService.loginUser(loginDto);
        if (uid > 0) {
            response.put("userid", uid);
            return ResponseEntity.ok(response);
        } else {
            response.put("message", -1L);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @PostMapping("/update/owner/{id}")
    public ResponseEntity<Map<String, Object>> updateOwner(@RequestBody OwnerDto ownerDto, @PathVariable Long id) {
        Long updatedOwner = userService.updatePotentialOwner(ownerDto, id);
        Map<String, Object> response = new HashMap<>();
        if (updatedOwner != null) {
            response.put("userid", updatedOwner);
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Update failed.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response); // Return error message as
                                                                                           // JSON
        }
    }

    @PostMapping("/update/center/{id}")
    public ResponseEntity<Map<String, Object>> updateCenter(@RequestBody CenterDto centerDto, @PathVariable Long id) {
        Long updatedOwner = userService.updateAdoptionCenter(centerDto, id);
        Map<String, Object> response = new HashMap<>();
        if (updatedOwner != null) {
            response.put("userid", updatedOwner);
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Update failed.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response); // Return error message as
                                                                                           // JSON
        }
    }

    @GetMapping("/centers/{id}/details")
    public ResponseEntity<Map<String, Object>> getCenterDetails(@PathVariable Long id) {
        Map<String, Object> response = userService.getCenterDetails(id);
        if (response == null) {
            log.warn("No center found for {}", id);
        }
        return ResponseEntity.ok(response);
    }
}
