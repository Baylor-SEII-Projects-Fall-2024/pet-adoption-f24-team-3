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
    public ResponseEntity<Long> registerAdoptionCenter(@RequestBody CenterDto centerDto) {
        Long newUserId = userService.registerCenter(centerDto);

        if (newUserId != null) {
            return ResponseEntity.ok(newUserId); // Return success message as JSON
        } else {
            return new ResponseEntity<>(null,HttpStatus.BAD_REQUEST); // Return error message as
            // JSON
        }
    }
    @PostMapping("/register/owner")
    public ResponseEntity<Long> registerPotentialOwner(@RequestBody OwnerDto ownerDto) {
        Long newOwnerId = userService.registerOwner(ownerDto);

        if (newOwnerId != null) {
            return ResponseEntity.ok(newOwnerId); // Return success message as JSON
        } else {
            return new ResponseEntity<>(null,HttpStatus.BAD_REQUEST); // Return error message as
            // JSON
        }
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(@RequestBody LoginDto loginDto) {
        User authenticatedUser = authenticationService.loginUser(loginDto);

        String jwtToken = jwtService.generateToken(authenticatedUser);

        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setToken(jwtToken);
        loginResponse.setExpiresIn(jwtService.getExpirationTime());
        loginResponse.setUserId(authenticatedUser.getId());

        return ResponseEntity.ok(loginResponse);
    }
}