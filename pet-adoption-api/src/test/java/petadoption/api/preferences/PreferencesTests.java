package petadoption.api.preferences;

import jakarta.transaction.Transactional;
import org.aspectj.lang.annotation.Before;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import petadoption.api.animal.AnimalAgeClass;
import petadoption.api.animal.AnimalSex;
import petadoption.api.animal.AnimalSize;
import petadoption.api.user.PotentialOwner;
import petadoption.api.user.PotentialOwnerRepository;
import petadoption.api.user.User;
import petadoption.api.user.UserService;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("testdb") // make these tests use the H2 in-memory DB instead of your actual DB
@Transactional
public class PreferencesTests {
    @Autowired
    private PreferenceService preferenceService;

    @Autowired
    private PotentialOwnerRepository potentialOwnerRepository;

    Preference preference;
    PotentialOwner potentialOwner;

    @Test
    @BeforeEach
    void testCreatePreferences() {
        potentialOwner = new PotentialOwner();
        potentialOwner.setAccountType("OWNER");
        potentialOwner.setEmailAddress("example@example.com");
        potentialOwner.setPassword("password");
        potentialOwner.setNameFirst("Old First");
        potentialOwner.setNameLast("Old Last");
        PotentialOwner savedUser = potentialOwnerRepository.save(potentialOwner);
        Long id = savedUser.getId();

        preference = new Preference();
        preference.setPotentialOwnerId(id);
        preference.setSpecies("TestSpecies");
        preference.setBreed("TestBreed");
        preference.setSex(AnimalSex.MALE);
        preference.setAgeClass(AnimalAgeClass.ADULT);
        preference.setSize(AnimalSize.MEDIUM);
        preference.setCity("TestCity");
        preference.setState("TestState");
        try {
            preference = preferenceService.savePreference(potentialOwner.getId(), preference);
            assertEquals(potentialOwner.getPreference(), preference);
        }catch (Exception e){
            fail("Exception thrown: " + e.getMessage());
        }
    }


    @Test
    void testFindPreferences() {
        assertFalse(preferenceService.findPreference(preference.getId()).isEmpty());
    }

    @Test
    void testFindPreferencesByOwnerId(){
        assertFalse(preferenceService.findPreferenceByOwnerId(potentialOwner.getId()).isEmpty());
    }

    @Test
    void testFindAllPreferences() {
        assertFalse(preferenceService.findAllPreferences().isEmpty());
    }
}
