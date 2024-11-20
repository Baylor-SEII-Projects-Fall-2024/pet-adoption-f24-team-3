package petadoption.api.security;

import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import petadoption.api.security.requestObjects.CenterDto;
import petadoption.api.security.requestObjects.LoginDto;
import petadoption.api.security.requestObjects.OwnerDto;
import petadoption.api.user.*;

import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("testdb") // make these tests use the H2 in-memory DB instead of your actual DB
@Transactional // make these tests revert their DB changes after the test is complete
public class AuthenticationTests {
    @Autowired
    private UserService userService;
    @Autowired
    private PotentialOwnerRepository potentialOwnerRepository;
    @Autowired
    private AuthenticationService authenticationService;

    @Test
    void testLogin(){
        OwnerDto ownerDto = new OwnerDto();
        ownerDto.setAccountType("OWNER");
        ownerDto.setEmailAddress("example@example.com");
        ownerDto.setPassword("Newpassword");
        ownerDto.setNameFirst("New First");
        ownerDto.setNameLast("New Last");

        PotentialOwner newUser = userService.registerOwner(ownerDto);

        LoginDto loginDto = new LoginDto();
        loginDto.setEmailAddress(ownerDto.getEmailAddress());

        assertNotNull(newUser);
        assertNotNull(newUser.getId());
        loginDto.setPassword(ownerDto.getPassword());

        User loggedInUser = authenticationService.loginUser(loginDto);

        assertNotNull( loggedInUser);
        assertNotNull(loggedInUser.getId());
        assertEquals(newUser.getId(), loggedInUser.getId());
    }

}
