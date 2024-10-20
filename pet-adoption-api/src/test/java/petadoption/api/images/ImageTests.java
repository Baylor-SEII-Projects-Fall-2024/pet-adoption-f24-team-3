package petadoption.api.images;

import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.multipart.MultipartFile;
import petadoption.api.animal.Animal;
import petadoption.api.animal.AnimalService;
import petadoption.api.event.Event;
import petadoption.api.event.EventService;
import petadoption.api.user.*;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("testdb") // make these tests use the H2 in-memory DB instead of your actual DB
@Transactional // make these tests revert their DB changes after the test is complete
public class ImageTests {
    @Autowired
    private UserService userService;
    @Autowired
    private AnimalService animalService;
    @Autowired
    private EventService eventService;
    @Autowired
    private ImageService imageService;
    @Autowired
    private ImageController imageController;

    private byte[] testImage;

    @BeforeEach
    void initTestImage(){
        try {
            //fetch the test image
            ClassPathResource resource = new ClassPathResource("testImage.png");
            File file = resource.getFile();
            assertTrue(file.exists());

            testImage = resource.getContentAsByteArray();
        }catch(Exception e){
            assert(e.getMessage().isEmpty());
        }
    }

    @Test
    void testProfilePic(){
        //create and save a new user
        User testUser = new PotentialOwner();
        testUser.setEmailAddress("test@test.com");
        testUser.setPassword("password");
        testUser = userService.saveUser(testUser);


        try {

            //Save pfp
            MultipartFile multipartFile = new MockMultipartFile("file",
                    "testPfp.png", "image/png", testImage);
            imageService.saveProfilePicture(multipartFile, testUser.getId());

            //test that it exists and contents are the same as the test image
            Path path = Paths.get(testUser.getProfilePicPath());
            File fileSaved = path.toFile();
            assertTrue(fileSaved.exists());
            assert (Arrays.equals(Files.readAllBytes(path), testImage));

            //Get the image using the endpoint
            byte [] fetchedImage = imageController.getUserProfilePic(testUser.getId()).getBody();
            //assert the image fetched is the same (not the fallback image)
            assert(Arrays.equals(fetchedImage, testImage));

            //delete the image
            boolean deleteSuccess = imageService.deleteProfilePicture(testUser.getId());
            assertTrue(deleteSuccess);
            //test that the path no longer exists, and that it's no longer saved
            assertFalse(fileSaved.exists());
            assertNull(testUser.getProfilePicPath());

        }
        catch (Exception e){
            assert(false);
        }

    }
    @Test
    void testCenterBannerPic(){
        //create and save a new user
        AdoptionCenter testUser = new AdoptionCenter();
        testUser.setEmailAddress("center@test.com");
        testUser.setPassword("password");
        testUser = (AdoptionCenter) userService.saveUser(testUser);


        try {

            //Save pfp
            MultipartFile multipartFile = new MockMultipartFile("file",
                    "testBanner.png", "image/png", testImage);
            imageService.saveCenterBanner(multipartFile, testUser.getId());

            //test that it exists and contents are the same as the test image
            Path path = Paths.get(testUser.getBannerPicPath());
            File fileSaved = path.toFile();
            assertTrue(fileSaved.exists());
            assert (Arrays.equals(Files.readAllBytes(path), testImage));

            //Get the image using the endpoint
            byte [] fetchedImage = imageController.getCenterBanner(testUser.getId()).getBody();
            //assert the image fetched is the same (not the fallback image)
            assert(Arrays.equals(fetchedImage, testImage));

            //delete the image
            boolean deleteSuccess = imageService.deleteCenterBanner(testUser.getId());
            assertTrue(deleteSuccess);
            //test that the path no longer exists, and that it's no longer saved
            assertFalse(fileSaved.exists());
            assertNull(testUser.getBannerPicPath());

        }
        catch (Exception e){
            assert(false);
        }

    }
    @Test
    void testAnimalPic(){
        //create and save a new user
        Animal testAnimal = new Animal();
        testAnimal.setName("Sanic");
        testAnimal = animalService.saveAnimal(testAnimal);


        try {

            //Save pfp
            MultipartFile multipartFile = new MockMultipartFile("file",
                    "testAnimalPic.png", "image/png", testImage);
            imageService.saveAnimalPicture(multipartFile, testAnimal.getId());

            //test that it exists and contents are the same as the test image
            Path path = Paths.get(testAnimal.getPicPath());
            File fileSaved = path.toFile();
            assertTrue(fileSaved.exists());
            assert (Arrays.equals(Files.readAllBytes(path), testImage));

            //Get the image using the endpoint
            byte [] fetchedImage = imageController.getAnimalPic(testAnimal.getId()).getBody();
            //assert the image fetched is the same (not the fallback image)
            assert(Arrays.equals(fetchedImage, testImage));

            //delete the image
            boolean deleteSuccess = imageService.deleteAnimalPicture(testAnimal.getId());
            assertTrue(deleteSuccess);
            //test that the path no longer exists, and that it's no longer saved
            assertFalse(fileSaved.exists());
            assertNull(testAnimal.getPicPath());

        }
        catch (Exception e){
            assert(false);
        }

    }
    @Test
    void testEventThumbnailPic(){
        //create and save a new user
        Event testEvent = new Event();
        testEvent.setName("Test Event");
        testEvent = eventService.saveEvent(testEvent);


        try {

            //Save pfp
            MultipartFile multipartFile = new MockMultipartFile("file",
                    "testEventPic.png", "image/png", testImage);
            imageService.saveEventThumbnail(multipartFile, testEvent.getId());

            //test that it exists and contents are the same as the test image
            Path path = Paths.get(testEvent.getThumbnailPath());
            File fileSaved = path.toFile();
            assertTrue(fileSaved.exists());
            assert (Arrays.equals(Files.readAllBytes(path), testImage));

            //Get the image using the endpoint
            byte [] fetchedImage = imageController.getEventThumbnail(testEvent.getId()).getBody();
            //assert the image fetched is the same (not the fallback image)
            assert(Arrays.equals(fetchedImage, testImage));

            //delete the image
            boolean deleteSuccess = imageService.deleteEventThumbnail(testEvent.getId());
            assertTrue(deleteSuccess);
            //test that the path no longer exists, and that it's no longer saved
            assertFalse(fileSaved.exists());
            assertNull(testEvent.getThumbnailPath());

        }
        catch (Exception e){
            assert(false);
        }

    }
}
