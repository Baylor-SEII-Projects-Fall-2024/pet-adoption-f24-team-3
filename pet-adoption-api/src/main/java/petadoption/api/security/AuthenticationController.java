package petadoption.api.security;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import petadoption.api.security.requestObjects.CenterDto;
import petadoption.api.security.requestObjects.LoginDto;
import petadoption.api.security.requestObjects.OwnerDto;
import petadoption.api.security.responseObjects.LoginResponse;
import petadoption.api.user.AdoptionCenter;
import petadoption.api.user.User;
import petadoption.api.user.UserService;

@RequestMapping("/api/auth")
@RestController
public class AuthenticationController {

    @Autowired
    private JwtService jwtService;
    @Autowired
    private UserService userService;
    @Autowired
    private AuthenticationService authenticationService;


    @PostMapping("/register/center")
    public ResponseEntity<LoginResponse> registerAdoptionCenter(@RequestBody CenterDto centerDto) {
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
}