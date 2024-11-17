package petadoption.api.animals;

import jakarta.transaction.Transactional;
import org.aspectj.lang.annotation.After;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.parameters.P;
import org.springframework.test.context.ActiveProfiles;
import petadoption.api.animal.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("testdb") // make these tests use the H2 in-memory DB instead of your actual DB
@Transactional
public class AnimalsTest {
    @Autowired
    AnimalService animalService;

    Animal animal;

    @Test
    @BeforeEach
    public void testCreateAnimal() {
        try {
            animal = new Animal();
            animal.setCenterId(1L);
            animal.setDatePosted(new Date());
            animal.setName("testName");
            animal.setAge(1);
            animal.setSpecies("testSpecies");
            animal.setBreed("testBreed");
            animal.setSex(AnimalSex.MALE);
            animal.setDescription("testDescription");
            animal.setSize(AnimalSize.MEDIUM);
            animal.setAgeClass(AnimalAgeClass.ADULT);
            animal.setHeight(1.0);
            animal.setWeight(1.0);
            animalService.saveAnimal(animal);
        }catch (Exception e) {
            fail("Exception thrown " + e.getMessage());
        }
    }
    @Test
    @AfterEach
    public void testDeleteAnimal() {
        testCreateAnimal();
        try {
            animalService.deleteAnimal(animal.getId());
            assertTrue(animalService.findAnimal(animal.getId()).isEmpty());
        }catch (Exception e){
            fail("Exception thrown " + e.getMessage());
        }
    }

    @Test
    public void testAdoptAnimal() {
        try {
            // Testing adopt
            animalService.updateAdoptStatus(animal.getId(), true);

            // Get updated animal
            Animal updatedAnimal = animalService.findAnimal(animal.getId()).orElse(null);
            if (updatedAnimal == null) {
                throw new Exception("Animal could not be found");
            }

            // Ensure both original and updated do not show up in the service methods
            assertFalse(animalService.findAllAnimals().contains(animal));
            assertFalse(animalService.findAllAnimals().contains(updatedAnimal));
            assertFalse(animalService.findAnimalsByCenterId(animal.getCenterId()).contains(animal));
            assertFalse(animalService.findAnimalsByCenterId(animal.getCenterId()).contains(updatedAnimal));

            // Ensure it is found when searching specifically for adopted animals
            assertTrue(animalService.findAdoptedAnimalsByCenterId(animal.getCenterId()).contains(updatedAnimal));

            // Testing undo adopt
            animalService.updateAdoptStatus(animal.getId(), false);

            // Get updated animal
            updatedAnimal = animalService.findAnimal(animal.getId()).orElse(null);
            if (updatedAnimal == null) {
                throw new Exception("Animal could not be found");
            }

            // Ensure both original and updated were removed from adopted list
            assertFalse(animalService.findAdoptedAnimalsByCenterId(animal.getCenterId()).contains(animal));
            assertFalse(animalService.findAdoptedAnimalsByCenterId(animal.getCenterId()).contains(updatedAnimal));

            // Ensure it shows up correctly in the service methods
            assertTrue(animalService.findAllAnimals().contains(updatedAnimal));
            assertTrue(animalService.findAnimalsByCenterId(animal.getCenterId()).contains(updatedAnimal));

        } catch (Exception e) {
            fail("Exception thrown " + e.getMessage());
        }
    }

    @Test
    public void testFindAllAnimals() {
        assertFalse(animalService.findAllAnimals().isEmpty());
    }

    @Test
    public void testFindAnimalById() {
        assertFalse(animalService.findAnimal(animal.getId()).isEmpty());
    }

    @Test
    public void testFindAnimalsByCenterId() {
        assertFalse(animalService.findAnimalsByCenterId(animal.getCenterId()).isEmpty());
    }

    @Test
    public void testRecommendAnimal(){
        try {
        //    assertFalse(animalService.recommendAnimals(1, new ArrayList<Long>()).isEmpty());
        }catch (Exception e){
            fail("Exception thrown" + e.getMessage());
        }
    }

    @Test
    public void testUpdateAnimal(){
        animal.setName("newName");
        animalService.updateAnimal(animal, animal.getId());
        assertFalse(animalService.findAnimal(animal.getId()).isEmpty());
        assertEquals(animal, animalService.findAnimal(animal.getId()).get());
    }
}
