package petadoption.api.recommendations;

import jakarta.transaction.Transactional;
import org.checkerframework.checker.units.qual.A;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import petadoption.api.animal.*;
import petadoption.api.user.PotentialOwner;
import petadoption.api.user.PotentialOwnerRepository;
import petadoption.api.user.UserService;
import petadoption.api.user.dtos.OwnerDto;

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

    @Test
    void testSexCompatibility(){
        OwnerDto ownerDto = new OwnerDto();
        ownerDto.setAccountType("OWNER");
        ownerDto.setEmailAddress("example@example.com");
        ownerDto.setPassword("Newpassword");
        ownerDto.setNameFirst("New First");
        ownerDto.setNameLast("New Last");

        Long newID = userService.registerOwner(ownerDto);

        PotentialOwner foundUser = potentialOwnerRepository.findById(newID).orElse(null);

        Animal animal = new Animal();
        animal.setCenterId(1L);
        animal.setDatePosted(new Date());
        animal.setName("Charles");
        animal.setAge(4);
        animal.setSpecies("Dog");
        animal.setBreed("Shihtzu");
        animal.setSex(AnimalSex.MALE);
        animal.setDescription("testDescription");
        animal.setSize(AnimalSize.MEDIUM);
        animal.setAgeClass(AnimalAgeClass.ADULT);
        animal.setHeight(1.0);
        animal.setWeight(1.0);
        animalService.saveAnimal(animal);


    }

}
