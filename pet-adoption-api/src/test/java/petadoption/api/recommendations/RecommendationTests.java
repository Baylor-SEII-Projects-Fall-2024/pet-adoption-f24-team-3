package petadoption.api.recommendations;

import jakarta.transaction.Transactional;
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

        double notMostCompat = recommendationsService.getSexCompatibility(newID, animalTwo.getId());

        assertNotEquals(testValue, notMostCompat);


    }

    @Test
    void testAgeCompatibility() throws Exception {
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
        animalOne.setAgeClass(AnimalAgeClass.BABY);
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
        animalThree.setAgeClass(AnimalAgeClass.BABY);
        animalThree.setHeight(1.0);
        animalThree.setWeight(1.0);
        animalService.saveAnimal(animalThree);

        recommendationsService.likeAnimal(newID, animalOne.getId());
        recommendationsService.likeAnimal(newID, animalTwo.getId());
        recommendationsService.likeAnimal(newID, animalThree.getId());

        double ageCompat = recommendationsService.getAgeCompatibility(newID, animalTwo.getId());
        double testValue = (double) 1 /2;

        assertEquals(testValue, ageCompat);

        double maxAgeCompat = recommendationsService.getAgeCompatibility(newID, animalThree.getId());

        assertEquals(1, maxAgeCompat);
    }

    @Test
    void testSizeCompatibility() throws Exception{
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
        animalOne.setAgeClass(AnimalAgeClass.BABY);
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
        animalTwo.setSize(AnimalSize.LARGE);
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
        animalThree.setAgeClass(AnimalAgeClass.BABY);
        animalThree.setHeight(1.0);
        animalThree.setWeight(1.0);
        animalService.saveAnimal(animalThree);

        recommendationsService.likeAnimal(newID, animalOne.getId());
        recommendationsService.likeAnimal(newID, animalTwo.getId());
        recommendationsService.likeAnimal(newID, animalThree.getId());

        double sizeCompat = recommendationsService.getSizeCompatibility(newID, animalTwo.getId());
        double testValue = (double) 1 /2;

        assertEquals(testValue, sizeCompat);

        double maxSizeCompat = recommendationsService.getSizeCompatibility(newID, animalThree.getId());

        assertEquals(1, maxSizeCompat);
    }

    @Test
    void testCenterCompatibility() throws Exception{
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

        AdoptionCenter adoptionCenterTwo = new AdoptionCenter();
        adoptionCenterTwo.setAccountType("OWNER");
        adoptionCenterTwo.setEmailAddress("other@example.com");
        adoptionCenterTwo.setPassword("otherPassword");
        adoptionCenterTwo.setAddress("Other Address");
        adoptionCenterTwo.setCity("Other City");
        adoptionCenterTwo.setState("Other State");
        adoptionCenterTwo.setZipCode("5678");
        AdoptionCenter savedUserTwo = adoptionCenterRepository.save(adoptionCenterTwo);
        Long idTwo = savedUserTwo.getId();

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
        animalOne.setAgeClass(AnimalAgeClass.BABY);
        animalOne.setHeight(1.0);
        animalOne.setWeight(1.0);
        animalService.saveAnimal(animalOne);

        Animal animalTwo = new Animal();
        animalTwo.setCenterId(idTwo);
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
        animalThree.setAgeClass(AnimalAgeClass.BABY);
        animalThree.setHeight(1.0);
        animalThree.setWeight(1.0);
        animalService.saveAnimal(animalThree);

        recommendationsService.likeAnimal(newID, animalOne.getId());
        recommendationsService.likeAnimal(newID, animalTwo.getId());
        recommendationsService.likeAnimal(newID, animalThree.getId());

        double centerCompat = recommendationsService.getCenterCompatibility(newID, animalTwo.getId());
        double testValue = 0.2;

        assertEquals(testValue, centerCompat);

        double maxCenterCompat = recommendationsService.getCenterCompatibility(newID, animalThree.getId());

        assertEquals(0.4, maxCenterCompat);
    }

    @Test
    void testStateCompatibility() throws Exception{
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

        AdoptionCenter adoptionCenterTwo = new AdoptionCenter();
        adoptionCenterTwo.setAccountType("OWNER");
        adoptionCenterTwo.setEmailAddress("other@example.com");
        adoptionCenterTwo.setPassword("otherPassword");
        adoptionCenterTwo.setAddress("Other Address");
        adoptionCenterTwo.setCity("Other City");
        adoptionCenterTwo.setState("Other State");
        adoptionCenterTwo.setZipCode("5678");
        AdoptionCenter savedUserTwo = adoptionCenterRepository.save(adoptionCenterTwo);
        Long idTwo = savedUserTwo.getId();

        OwnerDto ownerDto = new OwnerDto();
        ownerDto.setAccountType("OWNER");
        ownerDto.setEmailAddress("example@example.com");
        ownerDto.setPassword("Newpassword");
        ownerDto.setNameFirst("New First");
        ownerDto.setNameLast("New Last");

        Long newID = userService.registerOwner(ownerDto);

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
        animalOne.setAgeClass(AnimalAgeClass.BABY);
        animalOne.setHeight(1.0);
        animalOne.setWeight(1.0);
        animalService.saveAnimal(animalOne);

        Animal animalTwo = new Animal();
        animalTwo.setCenterId(idTwo);
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
        animalThree.setAgeClass(AnimalAgeClass.BABY);
        animalThree.setHeight(1.0);
        animalThree.setWeight(1.0);
        animalService.saveAnimal(animalThree);

        recommendationsService.likeAnimal(newID, animalOne.getId());
        recommendationsService.likeAnimal(newID, animalTwo.getId());
        recommendationsService.likeAnimal(newID, animalThree.getId());

        double stateCompat = recommendationsService.getStateCompatibility(newID, animalTwo.getId());
        double testValue = 0.3;

        assertEquals(testValue, stateCompat);

        double maxStateCompat = recommendationsService.getStateCompatibility(newID, animalThree.getId());

        assertEquals(0.6, maxStateCompat);
    }

    @Test
    void testCityCompatibility() throws Exception{
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

        AdoptionCenter adoptionCenterTwo = new AdoptionCenter();
        adoptionCenterTwo.setAccountType("OWNER");
        adoptionCenterTwo.setEmailAddress("other@example.com");
        adoptionCenterTwo.setPassword("otherPassword");
        adoptionCenterTwo.setAddress("Other Address");
        adoptionCenterTwo.setCity("Other City");
        adoptionCenterTwo.setState("Other State");
        adoptionCenterTwo.setZipCode("5678");
        AdoptionCenter savedUserTwo = adoptionCenterRepository.save(adoptionCenterTwo);
        Long idTwo = savedUserTwo.getId();

        OwnerDto ownerDto = new OwnerDto();
        ownerDto.setAccountType("OWNER");
        ownerDto.setEmailAddress("example@example.com");
        ownerDto.setPassword("Newpassword");
        ownerDto.setNameFirst("New First");
        ownerDto.setNameLast("New Last");

        Long newID = userService.registerOwner(ownerDto);

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
        animalOne.setAgeClass(AnimalAgeClass.BABY);
        animalOne.setHeight(1.0);
        animalOne.setWeight(1.0);
        animalService.saveAnimal(animalOne);

        Animal animalTwo = new Animal();
        animalTwo.setCenterId(idTwo);
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
        animalThree.setAgeClass(AnimalAgeClass.BABY);
        animalThree.setHeight(1.0);
        animalThree.setWeight(1.0);
        animalService.saveAnimal(animalThree);

        recommendationsService.likeAnimal(newID, animalOne.getId());
        recommendationsService.likeAnimal(newID, animalTwo.getId());
        recommendationsService.likeAnimal(newID, animalThree.getId());

        double cityCompat = recommendationsService.getCityCompatibility(newID, animalTwo.getId());
        double testValue = 0.3;

        assertEquals(testValue, cityCompat);

        double maxCityCompat = recommendationsService.getCityCompatibility(newID, animalThree.getId());

        assertEquals(0.6, maxCityCompat);
    }

}
