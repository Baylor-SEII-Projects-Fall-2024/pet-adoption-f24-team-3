package petadoption.api.user;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import petadoption.api.annotation.GlobalCrossOrigin;
import petadoption.api.security.JwtService;
import petadoption.api.security.requestObjects.CenterDto;
import petadoption.api.security.requestObjects.LoginDto;
import petadoption.api.security.requestObjects.OwnerDto;
import petadoption.api.user.dtos.ChangePasswordDto;
import petadoption.api.user.dtos.CheckOldPasswordDto;
import petadoption.api.user.responseObjects.AdoptionCenterCardResponse;
import petadoption.api.user.responseObjects.GenericUserDataResponse;
import petadoption.api.security.responseObjects.LoginResponse;
import petadoption.api.user.responseObjects.SessionUserDataResponse;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Log4j2
@RestController
@RequestMapping("/api")
@GlobalCrossOrigin
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

    @GetMapping("/users/sessionData")
    public SessionUserDataResponse getUserSessionData() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        User currentUser = (User) authentication.getPrincipal();

        if (currentUser == null) {
            log.warn("User not found");
            return null;
        }

        SessionUserDataResponse sessionUser = new SessionUserDataResponse();
        sessionUser.userId = currentUser.getId();
        sessionUser.accountType = currentUser.getAccountType();
        sessionUser.profilePicPath = currentUser.getProfilePicPath();
        if (currentUser instanceof PotentialOwner) {
            sessionUser.userFullName = ((PotentialOwner) currentUser).nameFirst + " " + ((PotentialOwner) currentUser).nameLast;
        } else if (currentUser instanceof AdoptionCenter) {
            sessionUser.userFullName = ((AdoptionCenter) currentUser).getName();
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

    // Request for verifying a user's old password -- used for password change preverification
    @PostMapping("/check-old-password/{userId}")
    public ResponseEntity<String> checkOldPassword(
            @PathVariable Long userId,
            @RequestBody CheckOldPasswordDto checkOldPasswordDto) {

        boolean isPasswordValid = userService.checkOldPassword(userId, checkOldPasswordDto.getOldPassword());

        if (isPasswordValid) {
            return ResponseEntity.ok("Old password is correct");
        } else {
            return ResponseEntity.status(400).body("Old password is incorrect");
        }
    }

    // Request for changing a users password
    @PostMapping("/change-password/{userId}")
    public ResponseEntity<String> changePassword(
            @PathVariable Long userId,
            @RequestBody ChangePasswordDto changePasswordDto) {

        User user = userService.findUser(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isPasswordChanged = userService.changePassword(user, changePasswordDto.getNewPassword());

        if (isPasswordChanged) {
            return ResponseEntity.ok("Password updated successfully!");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to update password");
        }
    }
}
