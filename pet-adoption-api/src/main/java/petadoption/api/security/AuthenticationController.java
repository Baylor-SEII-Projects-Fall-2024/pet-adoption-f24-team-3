package petadoption.api.security;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import petadoption.api.annotation.GlobalCrossOrigin;
import petadoption.api.security.requestObjects.CenterDto;
import petadoption.api.security.requestObjects.ChangePasswordDto;
import petadoption.api.security.requestObjects.CheckOldPasswordDto;
import petadoption.api.security.requestObjects.LoginDto;
import petadoption.api.security.requestObjects.OwnerDto;
import petadoption.api.security.responseObjects.LoginResponse;
import petadoption.api.user.AdoptionCenter;
import petadoption.api.user.User;
import petadoption.api.user.UserService;

import java.util.HashMap;
import java.util.Map;

@RequestMapping("/api/auth")
@RestController
@GlobalCrossOrigin
public class AuthenticationController {

    @Autowired
    private JwtService jwtService;
    @Autowired
    private UserService userService;
    @Autowired
    private AuthenticationService authenticationService;


    @PostMapping("/register/center")
    public ResponseEntity<LoginResponse> registerAdoptionCenter(@RequestBody CenterDto centerDto)   {
        User newCenter = userService.registerCenter(centerDto);

        if (newCenter != null) {
            LoginResponse authenticationResponse = generateLoginResponse(newCenter);
            return ResponseEntity.ok(authenticationResponse); // Return success message as JSON
        } else {
            return new ResponseEntity<>(null,HttpStatus.BAD_REQUEST); // Return error message as
            // JSON
        }
    }
    @PostMapping("/register/owner")
    public ResponseEntity<LoginResponse> registerPotentialOwner(@RequestBody OwnerDto ownerDto) {
        User newOwner = userService.registerOwner(ownerDto);

        if (newOwner != null) {
            LoginResponse authenticationResponse = generateLoginResponse(newOwner);
            return ResponseEntity.ok(authenticationResponse); // Return success message as JSON
        } else {
            return new ResponseEntity<>(null,HttpStatus.BAD_REQUEST); // Return error message as
            // JSON
        }
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(@RequestBody LoginDto loginDto) {
        User authenticatedUser = authenticationService.loginUser(loginDto);
        LoginResponse loginResponse = generateLoginResponse(authenticatedUser);
        return ResponseEntity.ok(loginResponse);
    }

    private LoginResponse generateLoginResponse(User authenticatedUser){
        String jwtToken = jwtService.generateToken(authenticatedUser);

        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setToken(jwtToken);
        loginResponse.setExpiresIn(jwtService.getExpirationTime());
        loginResponse.setUserId(authenticatedUser.getId());
        return loginResponse;
    }

    // Request for verifying a user's old password -- used for password change preverification
    @PostMapping("/check-old-password/{userId}")
    public ResponseEntity<Map<String, String>> checkOldPassword(
            @PathVariable Long userId,
            @RequestBody CheckOldPasswordDto checkOldPasswordDto) {

        boolean isPasswordValid = authenticationService.checkOldPassword(userId, checkOldPasswordDto.getOldPassword());

        Map<String, String> response = new HashMap<>();
        if (isPasswordValid) {
            response.put("message", "Old password is correct");
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Old password is incorrect");
            return ResponseEntity.status(400).body(response);
        }
    }

    // Request for changing a users password
    @PostMapping("/change-password/{userId}")
    public ResponseEntity<Map<String, String>> changePassword(
            @PathVariable Long userId,
            @RequestBody ChangePasswordDto changePasswordDto) {

        User user = userService.findUser(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isPasswordChanged = authenticationService.changePassword(user, changePasswordDto.getNewPassword());

        Map<String, String> response = new HashMap<>();
        if (isPasswordChanged) {
            response.put("message", "Password updated successfully");
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Failed to update password");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}