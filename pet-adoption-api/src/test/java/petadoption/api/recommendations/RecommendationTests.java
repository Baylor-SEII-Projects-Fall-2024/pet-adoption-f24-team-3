package petadoption.api.recommendations;

import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.mockito.internal.matchers.Null;
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

    private Long createAdoptionCenter(String email, String address, String city, String state, String zip) {
        AdoptionCenter center = new AdoptionCenter();
        center.setAccountType("OWNER");
        center.setEmailAddress(email);
        center.setPassword("password");
        center.setAddress(address);
        center.setCity(city);
        center.setState(state);
        center.setZipCode(zip);
        return adoptionCenterRepository.save(center).getId();
    }

    private Long registerOwner(String email, String firstName, String lastName) throws Exception {
        OwnerDto ownerDto = new OwnerDto();
        ownerDto.setAccountType("OWNER");
        ownerDto.setEmailAddress(email);
        ownerDto.setPassword("Newpassword");
        ownerDto.setNameFirst(firstName);
        ownerDto.setNameLast(lastName);
        return userService.registerOwner(ownerDto);
    }

    private Long createAndSaveAnimal(Long centerId, String name, int age, AnimalSex sex, AnimalSize size, AnimalAgeClass ageClass, String breed, String species) {
        Animal animal = new Animal();
        animal.setCenterId(centerId);
        animal.setDatePosted(new Date());
        animal.setName(name);
        animal.setAge(age);
        animal.setSpecies(species);
        animal.setBreed(breed);
        animal.setSex(sex);
        animal.setDescription("testDescription");
        animal.setSize(size);
        animal.setAgeClass(ageClass);
        animal.setHeight(1.0);
        animal.setWeight(1.0);
        return animalService.saveAnimal(animal).getId();
    }


    @Test
    void testAgeClassCompatibility() throws Exception {
        Long centerId = createAdoptionCenter("example@example.com", "Old Address", "Old City", "Old State", "1234");
        Long ownerId = registerOwner("example@example.com", "New First", "New Last");

        Long animalOneId = createAndSaveAnimal(centerId, "Charles", 4, AnimalSex.MALE, AnimalSize.MEDIUM, AnimalAgeClass.BABY, "Shitzu", "Dog");
        Long animalTwoId = createAndSaveAnimal(centerId, "Alakazam", 4, AnimalSex.MALE, AnimalSize.MEDIUM, AnimalAgeClass.ADULT, "Shitzu", "Dog");
        Long animalThreeId = createAndSaveAnimal(centerId, "Sharan", 4, AnimalSex.FEMALE, AnimalSize.MEDIUM, AnimalAgeClass.BABY, "Shitzu", "Dog");

        Animal animalOne = animalService.findAnimal(animalOneId).orElse(null);
        Animal animalTwo = animalService.findAnimal(animalTwoId).orElse(null);
        Animal animalThree = animalService.findAnimal(animalThreeId).orElse(null);

        recommendationsService.likeAnimal(ownerId, animalOneId);
        recommendationsService.likeAnimal(ownerId, animalTwoId);
        recommendationsService.likeAnimal(ownerId, animalThreeId);

        MappedInteractionHistory history = recommendationsService.findByUser(ownerId);

        assert animalOne != null;
        assert animalTwo != null;
        assertEquals(0.5, recommendationsService.getAgeClassCompatibility(animalTwo, history.getAgeClassHistory(), 1));
        assert animalThree != null;
        assertEquals(1.0, recommendationsService.getAgeClassCompatibility(animalThree, history.getAgeClassHistory(), 1));
    }

    @Test
    void testSizeCompatibility() throws Exception {
        Long centerId = createAdoptionCenter("example@example.com", "Old Address", "Old City", "Old State", "1234");
        Long ownerId = registerOwner("example@example.com", "New First", "New Last");

        Long animalOneId = createAndSaveAnimal(centerId, "Charles", 4, AnimalSex.MALE, AnimalSize.MEDIUM, AnimalAgeClass.BABY, "Shitzu", "Dog");
        Long animalTwoId = createAndSaveAnimal(centerId, "Alakazam", 4, AnimalSex.MALE, AnimalSize.LARGE, AnimalAgeClass.ADULT, "Shitzu", "Dog");
        Long animalThreeId = createAndSaveAnimal(centerId, "Sharan", 4, AnimalSex.FEMALE, AnimalSize.MEDIUM, AnimalAgeClass.BABY, "Shitzu", "Dog");

        recommendationsService.likeAnimal(ownerId, animalOneId);
        recommendationsService.likeAnimal(ownerId, animalTwoId);
        recommendationsService.likeAnimal(ownerId, animalThreeId);

        Animal animalOne = animalService.findAnimal(animalOneId).orElse(null);
        Animal animalTwo = animalService.findAnimal(animalTwoId).orElse(null);
        Animal animalThree = animalService.findAnimal(animalThreeId).orElse(null);
        MappedInteractionHistory history = recommendationsService.findByUser(ownerId);

        assert animalTwo != null;
        assertEquals(0.5, recommendationsService.getSizeCompatibility(animalTwo, history.getSizeHistory(), 1));
        assert animalThree != null;
        assertEquals(1.0, recommendationsService.getSizeCompatibility(animalThree, history.getSizeHistory(), 1));
    }


    @Test
    void testWeightCompatibility() throws Exception {
        Long centerOneId = createAdoptionCenter("example@example.com", "Old Address", "Old City", "Old State", "1234");
        Long centerTwoId = createAdoptionCenter("other@example.com", "Other Address", "Other City", "Other State", "5678");
        Long ownerId = registerOwner("example@example.com", "New First", "New Last");

        Long animalOneId = createAndSaveAnimal(centerOneId, "Charles", 4, AnimalSex.MALE, AnimalSize.MEDIUM, AnimalAgeClass.BABY, "Shitzu", "Dog");
        Long animalTwoId = createAndSaveAnimal(centerTwoId, "Alakazam", 4, AnimalSex.MALE, AnimalSize.MEDIUM, AnimalAgeClass.ADULT, "Shitzu", "Dog");
        Long animalThreeId = createAndSaveAnimal(centerOneId, "Sharan", 4, AnimalSex.FEMALE, AnimalSize.MEDIUM, AnimalAgeClass.BABY, "Shitzu", "Dog");

        Animal animalOne = animalService.findAnimal(animalOneId).orElse(null);
        assert animalOne != null;
        animalOne.setWeight(5.0);
        animalService.saveAnimal(animalOne);

        Animal animalTwo = animalService.findAnimal(animalTwoId).orElse(null);
        assert animalTwo != null;
        animalTwo.setWeight(2.0);
        animalService.saveAnimal(animalTwo);

        Animal animalThree = animalService.findAnimal(animalThreeId).orElse(null);
        assert animalThree != null;
        animalThree.setWeight(5.0);
        animalService.saveAnimal(animalThree);

        recommendationsService.likeAnimal(ownerId, animalOneId);
        recommendationsService.likeAnimal(ownerId, animalTwoId);
        recommendationsService.likeAnimal(ownerId, animalThreeId);

        MappedInteractionHistory history = recommendationsService.findByUser(ownerId);

        assertEquals(-0.5, recommendationsService.getWeightCompatibility(animalTwo, history, 1));
        assertEquals(0.25, recommendationsService.getWeightCompatibility(animalThree, history, 1));
    }

    @Test
    void testHeightCompatibility() throws Exception {
        Long centerOneId = createAdoptionCenter("example@example.com", "Old Address", "Old City", "Old State", "1234");
        Long centerTwoId = createAdoptionCenter("other@example.com", "Other Address", "Other City", "Other State", "5678");
        Long ownerId = registerOwner("example@example.com", "New First", "New Last");

        Long animalOneId = createAndSaveAnimal(centerOneId, "Charles", 4, AnimalSex.MALE, AnimalSize.MEDIUM, AnimalAgeClass.BABY, "Shitzu", "Dog");
        Long animalTwoId = createAndSaveAnimal(centerTwoId, "Alakazam", 4, AnimalSex.MALE, AnimalSize.MEDIUM, AnimalAgeClass.ADULT, "Shitzu", "Dog");
        Long animalThreeId = createAndSaveAnimal(centerOneId, "Sharan", 4, AnimalSex.FEMALE, AnimalSize.MEDIUM, AnimalAgeClass.BABY, "Shitzu", "Dog");

        Animal animalOne = animalService.findAnimal(animalOneId).orElse(null);
        assert animalOne != null;
        animalOne.setHeight(5.0);
        animalService.saveAnimal(animalOne);

        Animal animalTwo = animalService.findAnimal(animalTwoId).orElse(null);
        assert animalTwo != null;
        animalTwo.setHeight(2.0);
        animalService.saveAnimal(animalTwo);

        Animal animalThree = animalService.findAnimal(animalThreeId).orElse(null);
        assert animalThree != null;
        animalThree.setHeight(5.0);
        animalService.saveAnimal(animalThree);

        recommendationsService.likeAnimal(ownerId, animalOneId);
        recommendationsService.likeAnimal(ownerId, animalTwoId);
        recommendationsService.likeAnimal(ownerId, animalThreeId);
        MappedInteractionHistory history = recommendationsService.findByUser(ownerId);

        assertEquals(-0.5, recommendationsService.getHeightCompatibility(animalTwo, history, 1));
        assertEquals(0.25, recommendationsService.getHeightCompatibility(animalThree, history, 1));
    }

    @Test
    void testAgeCompatibility() throws Exception {
        Long centerOneId = createAdoptionCenter("example@example.com", "Old Address", "Old City", "Old State", "1234");
        Long centerTwoId = createAdoptionCenter("other@example.com", "Other Address", "Other City", "Other State", "5678");
        Long ownerId = registerOwner("example@example.com", "New First", "New Last");

        Long animalOneId = createAndSaveAnimal(centerOneId, "Charles", 4, AnimalSex.MALE, AnimalSize.MEDIUM, AnimalAgeClass.BABY, "Shitzu", "Dog");
        Long animalTwoId = createAndSaveAnimal(centerTwoId, "Alakazam", 7, AnimalSex.MALE, AnimalSize.MEDIUM, AnimalAgeClass.ADULT, "Shitzu", "Dog");
        Long animalThreeId = createAndSaveAnimal(centerOneId, "Sharan", 4, AnimalSex.FEMALE, AnimalSize.MEDIUM, AnimalAgeClass.BABY, "Shitzu", "Dog");

        recommendationsService.likeAnimal(ownerId, animalOneId);
        recommendationsService.likeAnimal(ownerId, animalTwoId);
        recommendationsService.likeAnimal(ownerId, animalThreeId);

        Animal animalOne = animalService.findAnimal(animalOneId).orElse(null);
        Animal animalTwo = animalService.findAnimal(animalTwoId).orElse(null);
        Animal animalThree = animalService.findAnimal(animalThreeId).orElse(null);
        MappedInteractionHistory history = recommendationsService.findByUser(ownerId);

        assert animalTwo != null;
        assertEquals(0.4, recommendationsService.getAgeCompatibility(animalTwo, history, 1));
        assert animalThree != null;
        assertEquals(-0.2, recommendationsService.getAgeCompatibility(animalThree, history, 1));
    }

    @Test
    void testCompatibilityScore() throws Exception {
        Long centerOneId = createAdoptionCenter("example@example.com", "Old Address", "Old City", "Old State", "1234");
        Long centerTwoId = createAdoptionCenter("other@example.com", "Other Address", "Other City", "Other State", "5678");
        Long ownerId = registerOwner("example@example.com", "New First", "New Last");

        Long animalOneId = createAndSaveAnimal(centerOneId, "Charles", 4, AnimalSex.MALE, AnimalSize.MEDIUM, AnimalAgeClass.BABY, "Shitzu", "Dog");
        Long animalTwoId = createAndSaveAnimal(centerTwoId, "Alakazam", 7, AnimalSex.MALE, AnimalSize.MEDIUM, AnimalAgeClass.ADULT, "Shitzu", "Dog");
        Long animalThreeId = createAndSaveAnimal(centerOneId, "Sharan", 4, AnimalSex.FEMALE, AnimalSize.MEDIUM, AnimalAgeClass.BABY, "Shitzu", "Dog");
        Long animalFourId = createAndSaveAnimal(centerOneId, "Dave", 4, AnimalSex.MALE, AnimalSize.MEDIUM, AnimalAgeClass.BABY, "Shitzu", "Dog");
        Long animalDiffId = createAndSaveAnimal(centerOneId, "Ashlen", 4, AnimalSex.FEMALE, AnimalSize.LARGE, AnimalAgeClass.ADULT, "Tabby", "Cat");

        recommendationsService.likeAnimal(ownerId, animalOneId);
        recommendationsService.likeAnimal(ownerId, animalTwoId);
        recommendationsService.likeAnimal(ownerId, animalThreeId);

        Animal animalOne = animalService.findAnimal(animalOneId).orElse(null);
        Animal animalTwo = animalService.findAnimal(animalTwoId).orElse(null);
        Animal animalThree = animalService.findAnimal(animalThreeId).orElse(null);
        Animal animalFour = animalService.findAnimal(animalFourId).orElse(null);
        Animal animalDiff = animalService.findAnimal(animalDiffId).orElse(null);
        MappedInteractionHistory history = recommendationsService.findByUser(ownerId);

        assert animalFour != null;
        double fourScore = recommendationsService.calculateCompatibilityScore(animalFour, history);
        assert animalDiff != null;
        double diffScore = recommendationsService.calculateCompatibilityScore(animalDiff, history);

        System.out.println(fourScore);
        System.out.println(diffScore);
        assert(fourScore > diffScore);

    }

}
