package petadoption.api.recommendations;

import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import petadoption.api.animal.*;
import petadoption.api.user.*;
import petadoption.api.security.requestObjects.CenterDto;
import petadoption.api.security.requestObjects.OwnerDto;
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
    void testCreateHistoryOnAccountCreation() throws  Exception{
        AdoptionCenter center = new AdoptionCenter();
        center.setName("Test");
        center.setEmailAddress("test@test");
        center.setPassword("Woof");

        //check it doesnt initially exist
        InteractionHistory centerHistory = recommendationsService.findByUser(center.getId());
        assertNull(centerHistory);

        //save the user
        center = (AdoptionCenter) userService.saveUser(center);

        //check that it exists now
        centerHistory = recommendationsService.findByUser(center.getId());
        assertNotNull(centerHistory);
        assertEquals(centerHistory.getUserId(),center.getId());

        //test it with the dto method
        CenterDto centerDto = new CenterDto();
        centerDto.setName("Test");
        centerDto.setEmailAddress("test@test78r6645t87");
        centerDto.setPassword("Woof");

        Long dtoCenterId = userService.registerCenter(centerDto);
        InteractionHistory dtoCenterHistory = recommendationsService.findByUser(dtoCenterId);
        assertNotNull(dtoCenterHistory);
        assertEquals(dtoCenterId, dtoCenterHistory.getUserId());

        //do it with the potential owner dto method
        OwnerDto ownerDto = new OwnerDto();
        ownerDto.setNameFirst("Joe");
        ownerDto.setEmailAddress("test@test6567575747535456543424354657");
        ownerDto.setPassword("Woof");

        Long dtoOwnerId = userService.registerOwner(ownerDto);
        InteractionHistory dtoOwnerHistory = recommendationsService.findByUser(dtoOwnerId);
        assertNotNull(dtoOwnerHistory);
        assertEquals(dtoOwnerId, dtoOwnerHistory.getUserId());
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

        MappedInteractionHistory history = recommendationsService.findByUserMapped(ownerId);

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
        MappedInteractionHistory history = recommendationsService.findByUserMapped(ownerId);

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

        Animal animalFour = new Animal();
        animalFour.setWeight(10.0);
        animalFour = animalService.saveAnimal(animalFour);

        recommendationsService.likeAnimal(ownerId, animalOneId);
        recommendationsService.likeAnimal(ownerId, animalTwoId);
        recommendationsService.likeAnimal(ownerId, animalThreeId);

        MappedInteractionHistory history = recommendationsService.findByUserMapped(ownerId);

        assertEquals(0.5, recommendationsService.getWeightCompatibility(animalTwo, history, 1));
        assertEquals(0.75, recommendationsService.getWeightCompatibility(animalThree, history, 1));
        assertEquals(0, recommendationsService.getWeightCompatibility(animalFour, history, 1));

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
        MappedInteractionHistory history = recommendationsService.findByUserMapped(ownerId);

        assertEquals(0.5, recommendationsService.getHeightCompatibility(animalTwo, history, 1));
        assertEquals(0.75, recommendationsService.getHeightCompatibility(animalThree, history, 1));
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
        MappedInteractionHistory history = recommendationsService.findByUserMapped(ownerId);

        assert animalTwo != null;
        assertEquals(0.6, recommendationsService.getAgeCompatibility(animalTwo, history, 1));
        assert animalThree != null;
        assertEquals(0.8, recommendationsService.getAgeCompatibility(animalThree, history, 1));
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
        MappedInteractionHistory history = recommendationsService.findByUserMapped(ownerId);

        assert animalFour != null;
        double fourScore = recommendationsService.calculateCompatibilityScore(animalFour, history);
        assert animalDiff != null;
        double diffScore = recommendationsService.calculateCompatibilityScore(animalDiff, history);

        System.out.println(fourScore);
        System.out.println(diffScore);
        assert(fourScore > diffScore);

    }

    @Test
    void testLikeAnimal() throws Exception{
        //create owner and make sure their interaction history is blank
        Long ownerId = registerOwner("example@example.com", "New First", "New Last");

        InteractionHistory history = recommendationsService.findByUser(ownerId);
        assertEquals(history.getTotalLikes(),0);
        assertEquals(history.getInteractionPoints().size(),0);


        //create some centers with animals, and like two, dislike 1, dont do anything for one
        Long centerOneId = createAdoptionCenter("example@example.com", "Old Address", "Old City", "Old State", "1234");
        Long centerTwoId = createAdoptionCenter("other@example.com", "Other Address", "Other City", "Other State", "5678");


        Long likedAnimalOneId = createAndSaveAnimal(centerOneId, "Charles", 4, AnimalSex.MALE, AnimalSize.MEDIUM, AnimalAgeClass.BABY, "Shitzu", "Dog");
        Long likedAnimalTwoId = createAndSaveAnimal(centerTwoId, "Alakazam", 7, AnimalSex.FEMALE, AnimalSize.MEDIUM, AnimalAgeClass.ADULT, "Shitzu", "Dog");
        Long dislikedAnimalId = createAndSaveAnimal(centerTwoId, "Sam", 4, AnimalSex.FEMALE, AnimalSize.LARGE, AnimalAgeClass.ADULT, "Golden Retriever", "Dog");
        Long notInteractedAnimalId = createAndSaveAnimal(centerOneId, "Fredrick", 6, AnimalSex.MALE, AnimalSize.SMALL, AnimalAgeClass.ADOLESCENT, "Tabby", "Cat");


        recommendationsService.likeAnimal(ownerId, likedAnimalOneId);
        recommendationsService.likeAnimal(ownerId, likedAnimalTwoId);
        recommendationsService.dislikeAnimal(ownerId, dislikedAnimalId);

        //get the new mapped history of the liked animals
        MappedInteractionHistory mappedHistory = recommendationsService.findByUserMapped(ownerId);

        //check sex
        assertEquals(mappedHistory.getSexHistory().get("MALE"),1);
        assertEquals(mappedHistory.getSexHistory().get("FEMALE"),0);

        //check size
        assertEquals(mappedHistory.getSizeHistory().get("MEDIUM"),2);
        assertEquals(mappedHistory.getSizeHistory().get("LARGE"),-1);

        //check age class
        assertEquals(mappedHistory.getAgeClassHistory().get("BABY"),1);
        assertEquals(mappedHistory.getAgeClassHistory().get("ADULT"),0);

        //check breed
        assertEquals(mappedHistory.getBreedHistory().get("Shitzu"),2);
        assertEquals(mappedHistory.getBreedHistory().get("Golden Retriever"),-1);

        //check species
        assertEquals(mappedHistory.getSpeciesHistory().get("Dog"),1);

        //check average age
        double avgAge = (double) (4 + 7) /2.0;
        assertEquals(mappedHistory.getAvgAge(),avgAge);

        //check city
        assertEquals(mappedHistory.getCityHistory().get("Old City"),1);
        assertEquals(mappedHistory.getCityHistory().get("Other City"),0);

        //check state
        assertEquals(mappedHistory.getStateHistory().get("Old State"),1);
        assertEquals(mappedHistory.getStateHistory().get("Other State"),0);

        //check the ids have been stored (or not stored)
        assertNotNull(mappedHistory.getAnimalHistory().get(likedAnimalOneId.toString()));
        assertNotNull(mappedHistory.getAnimalHistory().get(likedAnimalTwoId.toString()));
        assertNotNull(mappedHistory.getAnimalHistory().get(dislikedAnimalId.toString()));
        assertNull(mappedHistory.getAnimalHistory().get(notInteractedAnimalId.toString()));


        //check the scores stored for each animal
        int score1 = recommendationsService.isAnimalLikedOrDisliked(ownerId,likedAnimalOneId);
        assertEquals(score1,1);
        int score2 = recommendationsService.isAnimalLikedOrDisliked(ownerId,likedAnimalTwoId);
        assertEquals(score2,1);
        int score3 = recommendationsService.isAnimalLikedOrDisliked(ownerId,dislikedAnimalId);
        assertEquals(score3,-1);
        int score4 = recommendationsService.isAnimalLikedOrDisliked(ownerId,notInteractedAnimalId);
        assertEquals(score4,0);

    }
}
