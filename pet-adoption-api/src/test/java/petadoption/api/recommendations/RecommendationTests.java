package petadoption.api.recommendations;

import jakarta.transaction.Transactional;
import org.checkerframework.checker.units.qual.A;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import petadoption.api.animal.*;
import petadoption.api.user.*;
import petadoption.api.user.dtos.OwnerDto;
import static org.junit.jupiter.api.Assertions.*;


import java.util.Date;

@SpringBootTest
@ActiveProfiles("testdb") // make these tests use the H2 in-memory DB instead of your actual DB
@Transactional // make these tests revert their DB changes after the test is complete
public class RecommendationTests {
    @Autowired
    private RecommendationsService recommendationsService;

    @Autowired
    private UserService userService;

    @Autowired
    private AnimalService animalService;

    @Autowired
    private PotentialOwnerRepository potentialOwnerRepository;

    @Autowired
    private AdoptionCenterRepository adoptionCenterRepository;

    @Test
    void testSexCompatibility() throws Exception {
        AdoptionCenter adoptionCenter = new AdoptionCenter();
        adoptionCenter.setAccountType("OWNER");
        adoptionCenter.setEmailAddress("example@example.com");
        adoptionCenter.setPassword("password");
        adoptionCenter.setAddress("Old Address");
        adoptionCenter.setCity("Old City");
        adoptionCenter.setState("Old State");
        adoptionCenter.setZipCode("1234");
        AdoptionCenter savedUser = adoptionCenterRepository.save(adoptionCenter);
        Long id = savedUser.getId();

        OwnerDto ownerDto = new OwnerDto();
        ownerDto.setAccountType("OWNER");
        ownerDto.setEmailAddress("example@example.com");
        ownerDto.setPassword("Newpassword");
        ownerDto.setNameFirst("New First");
        ownerDto.setNameLast("New Last");

        Long newID = userService.registerOwner(ownerDto);

        PotentialOwner foundUser = potentialOwnerRepository.findById(newID).orElse(null);

        Animal animalOne = new Animal();
        animalOne.setCenterId(id);
        animalOne.setDatePosted(new Date());
        animalOne.setName("Charles");
        animalOne.setAge(4);
        animalOne.setSpecies("Dog");
        animalOne.setBreed("Shihtzu");
        animalOne.setSex(AnimalSex.MALE);
        animalOne.setDescription("testDescription");
        animalOne.setSize(AnimalSize.MEDIUM);
        animalOne.setAgeClass(AnimalAgeClass.ADULT);
        animalOne.setHeight(1.0);
        animalOne.setWeight(1.0);
        animalService.saveAnimal(animalOne);

        Animal animalTwo = new Animal();
        animalTwo.setCenterId(id);
        animalTwo.setDatePosted(new Date());
        animalTwo.setName("Alakazam");
        animalTwo.setAge(4);
        animalTwo.setSpecies("Dog");
        animalTwo.setBreed("Shihtzu");
        animalTwo.setSex(AnimalSex.MALE);
        animalTwo.setDescription("testDescription");
        animalTwo.setSize(AnimalSize.MEDIUM);
        animalTwo.setAgeClass(AnimalAgeClass.ADULT);
        animalTwo.setHeight(1.0);
        animalTwo.setWeight(1.0);
        animalService.saveAnimal(animalTwo);

        Animal animalThree = new Animal();
        animalThree.setCenterId(id);
        animalThree.setDatePosted(new Date());
        animalThree.setName("Sharan");
        animalThree.setAge(4);
        animalThree.setSpecies("Dog");
        animalThree.setBreed("Shihtzu");
        animalThree.setSex(AnimalSex.FEMALE);
        animalThree.setDescription("testDescription");
        animalThree.setSize(AnimalSize.MEDIUM);
        animalThree.setAgeClass(AnimalAgeClass.ADULT);
        animalThree.setHeight(1.0);
        animalThree.setWeight(1.0);
        animalService.saveAnimal(animalThree);

        recommendationsService.likeAnimal(newID, animalOne.getId());
        recommendationsService.likeAnimal(newID, animalTwo.getId());
        recommendationsService.likeAnimal(newID, animalThree.getId());

        double sexCompat = recommendationsService.getSexCompatibility(newID, animalThree.getId());
        double testValue = (double) 1 /2;

        assertEquals(testValue, sexCompat);


    }

}
