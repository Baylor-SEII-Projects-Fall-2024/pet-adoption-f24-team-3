package petadoption.api.user;

import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import petadoption.api.user.dtos.CenterDto;
import petadoption.api.user.dtos.OwnerDto;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("testdb") // make these tests use the H2 in-memory DB instead of your actual DB
@Transactional // make these tests revert their DB changes after the test is complete
public class UserTests {
    @Autowired
    private UserService userService;
    @Autowired
    private PotentialOwnerRepository potentialOwnerRepository;
    @Autowired
    private AdoptionCenterRepository adoptionCenterRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    void testUserCreate() {
        User newUser = new User();
        newUser.accountType = "PETOWNER";
        newUser.emailAddress = "example@example.com";
        newUser.password = "password";

        User savedUser = userService.saveUser(newUser);
        assertNotNull(savedUser.id);

        Optional<User> foundUserOpt = userService.findUser(savedUser.id);
        assertTrue(foundUserOpt.isPresent());
        User foundUser = foundUserOpt.get();

        assertEquals(newUser.accountType, foundUser.accountType);
        assertEquals(newUser.emailAddress, foundUser.emailAddress);
        assertEquals(newUser.password, foundUser.password);
    }

    @Test
    void testUserFind() {
        Optional<User> user1 = userService.findUser(1L);
        assertTrue(user1.isEmpty());
    }

    @Test
    void testOwnerUpdate() {
        PotentialOwner potentialOwner = new PotentialOwner();
        potentialOwner.accountType = "OWNER";
        potentialOwner.emailAddress = "example@example.com";
        potentialOwner.password = "password";
        potentialOwner.setNameFirst("Old First");
        potentialOwner.setNameLast("Old Last");
        PotentialOwner savedUser = potentialOwnerRepository.save(potentialOwner);
        Long id = savedUser.id;

        OwnerDto ownerDto = new OwnerDto();
        ownerDto.setAccountType("OWNER");
        ownerDto.setEmailAddress("newEx@example.com");
        ownerDto.setPassword("Newpassword");
        ownerDto.setNameFirst("New First");
        ownerDto.setNameLast("New Last");

        assertNotEquals(potentialOwner.getEmailAddress(), ownerDto.getEmailAddress());

        Long newID = userService.updatePotentialOwner(ownerDto, id);
        assertNotNull(newID);
        PotentialOwner foundUser = potentialOwnerRepository.findById(newID).orElse(null);
        assertNotNull(foundUser);
        assertEquals(savedUser.id, foundUser.id);
        assertEquals(ownerDto.getEmailAddress(), foundUser.emailAddress);
        assertEquals(ownerDto.getNameFirst(), foundUser.getNameFirst());
        assertEquals(ownerDto.getNameLast(), foundUser.getNameLast());

        assertTrue(passwordEncoder.matches(ownerDto.getPassword(), foundUser.getPassword()));

    }

    @Test
    void testCenterUpdate() {
        AdoptionCenter adoptionCenter = new AdoptionCenter();
        adoptionCenter.accountType = "OWNER";
        adoptionCenter.emailAddress = "example@example.com";
        adoptionCenter.password = "password";
        adoptionCenter.setAddress("Old Address");
        adoptionCenter.setCity("Old City");
        adoptionCenter.setState("Old State");
        adoptionCenter.setZipCode("1234");
        AdoptionCenter savedUser = adoptionCenterRepository.save(adoptionCenter);
        Long id = savedUser.id;

        CenterDto centerDto = new CenterDto();
        centerDto.setAccountType("CENTER");
        centerDto.setEmailAddress("newEx@example.com");
        centerDto.setPassword("Newpassword"); //can't really test easily because of password encryption
        centerDto.setAddress("New place");
        centerDto.setCity("New city");
        centerDto.setState("New State");
        centerDto.setZipCode("5678");

        Long newID = userService.updateAdoptionCenter(centerDto, id);
        assertNotNull(newID);
        AdoptionCenter foundUser = adoptionCenterRepository.findById(newID).orElse(null);
        assertNotNull(foundUser);
        assertEquals(savedUser.id, foundUser.id);
        assertEquals(centerDto.getEmailAddress(), foundUser.emailAddress);
        assertEquals(centerDto.getAddress(), foundUser.getAddress());
        assertEquals(centerDto.getCity(), foundUser.getCity());

        assertTrue(passwordEncoder.matches(centerDto.getPassword(), foundUser.getPassword()));

    }
}
