package petadoption.api.images;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import petadoption.api.animal.Animal;
import petadoption.api.animal.AnimalService;
import petadoption.api.event.Event;
import petadoption.api.event.EventService;
import petadoption.api.user.AdoptionCenter;
import petadoption.api.user.User;
import petadoption.api.user.UserService;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Log4j2
@RestController
@CrossOrigin(origins = { "http://localhost:3000", "http://35.184.141.85:3000" })
@RequestMapping("/api/images")
public class ImageController {
    @Autowired
    private ImageService imageService;
    @Autowired
    UserService userService;
    @Autowired
    AnimalService animalService;
    @Autowired
    EventService eventService;

    @GetMapping("/users/{userId}/profile")
    public ResponseEntity<byte[]> getUserProfilePic(@PathVariable Long userId) throws Exception {

        User user = userService.findUser(userId).orElse(null);

        if (user == null) {
            log.error("User " + userId + " not found!");
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

        try {
            Path filePath = Paths.get(user.getProfilePicPath());
            byte[] pictureFile = Files.readAllBytes(filePath);

            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_TYPE, Files.probeContentType(filePath));

            return new ResponseEntity<>(pictureFile, headers, HttpStatus.OK);
        } catch (NullPointerException e) {// if here, the image was not found, return placeholder image
            ClassPathResource resource = new ClassPathResource("placeholders/profile_picture.png");
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_PNG) // Set the appropriate content type
                    .body(resource.getContentAsByteArray());
        }

    }

    @GetMapping("/users/{userId}/banner")
    public ResponseEntity<byte[]> getCenterBanner(@PathVariable Long userId) throws Exception {

        AdoptionCenter user = userService.findAdoptionCenter(userId).orElse(null);

        if (user == null) {
            log.error("Adoption Center " + userId + " not found!");
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
        try {
            Path filePath = Paths.get(user.getBannerPicPath());
            byte[] pictureFile = Files.readAllBytes(filePath);

            if (pictureFile.length < 1) {
                throw new Exception("File is empty!");
            }

            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_TYPE, Files.probeContentType(filePath));

            return new ResponseEntity<>(pictureFile, headers, HttpStatus.OK);
        } catch (Exception e) {
            ClassPathResource resource = new ClassPathResource("placeholders/center_banner.png");
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_PNG) // Set the appropriate content type
                    .body(resource.getContentAsByteArray());
        }
    }

    @GetMapping("/animals/{animalId}")
    public ResponseEntity<byte[]> getAnimalPic(@PathVariable Long animalId) throws Exception {

        Animal animal = animalService.findAnimal(animalId).orElse(null);

        if (animal == null) {
            log.error("Animal " + animalId + " not found!");
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
        try {
            Path filePath = Paths.get(animal.getPicPath());
            byte[] pictureFile = Files.readAllBytes(filePath);

            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_TYPE, Files.probeContentType(filePath));

            return new ResponseEntity<>(pictureFile, headers, HttpStatus.OK);
        } catch (NullPointerException e) {
            ClassPathResource resource = new ClassPathResource("placeholders/animal.png");
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_PNG) // Set the appropriate content type
                    .body(resource.getContentAsByteArray());
        }
    }

    @GetMapping("/events/{eventId}")
    public ResponseEntity<byte[]> getEventThumbnail(@PathVariable Long eventId) throws Exception {

        Event event = eventService.findEvent(eventId).orElse(null);

        if (event == null) {
            log.error("Event " + eventId + " not found!");
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
        try {
            Path filePath = Paths.get(event.getThumbnailPath());
            byte[] pictureFile = Files.readAllBytes(filePath);

            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_TYPE, Files.probeContentType(filePath));

            return new ResponseEntity<>(pictureFile, headers, HttpStatus.OK);
        } catch (NullPointerException e) {
            ClassPathResource resource = new ClassPathResource("placeholders/event.png");
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_PNG) // Set the appropriate content type
                    .body(resource.getContentAsByteArray());
        }
    }

    @PostMapping("/users/{userId}/profile")
    public ResponseEntity<Object> uploadProfilePic(@PathVariable Long userId,
            @RequestParam("imageFile") MultipartFile imageFile) {
        try {
            imageService.saveProfilePicture(imageFile, userId);
            return new ResponseEntity<>(true, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/users/{userId}/banner")
    public ResponseEntity<Object> uploadCenterBanner(@PathVariable Long userId,
            @RequestParam("imageFile") MultipartFile imageFile) {
        try {
            imageService.saveCenterBanner(imageFile, userId);
            return new ResponseEntity<>(true, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/animals/{animalId}")
    public ResponseEntity<Object> uploadAnimalPic(@PathVariable Long animalId,
            @RequestParam("imageFile") MultipartFile imageFile) {
        try {
            imageService.saveAnimalPicture(imageFile, animalId);
            return new ResponseEntity<>(true, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/events/{eventId}")
    public ResponseEntity<Object> uploadEventThumbnail(@PathVariable Long eventId,
            @RequestParam("imageFile") MultipartFile imageFile) {
        try {
            imageService.saveEventThumbnail(imageFile, eventId);
            return new ResponseEntity<>(true, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/users/{userId}/profile")
    public ResponseEntity<Object> deleteProfilePic(@PathVariable Long userId) {
        try {
            boolean result = imageService.deleteProfilePicture(userId);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/users/{userId}/banner")
    public ResponseEntity<Object> deleteBannerPic(@PathVariable Long userId) {
        try {
            boolean result = imageService.deleteCenterBanner(userId);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/animals/{animalId}")
    public ResponseEntity<Object> deleteAnimalPic(@PathVariable Long animalId) {
        try {
            boolean result = imageService.deleteAnimalPicture(animalId);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/events/{eventId}")
    public ResponseEntity<Object> deleteEventThumbnail(@PathVariable Long eventId) {
        try {
            boolean result = imageService.deleteEventThumbnail(eventId);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

}