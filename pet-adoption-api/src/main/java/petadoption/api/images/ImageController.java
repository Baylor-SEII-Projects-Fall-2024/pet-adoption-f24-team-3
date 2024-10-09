package petadoption.api.images;


import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
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

        if(user == null){
            throw new Exception("User not found!");
        }

        Path filePath = Paths.get(user.getProfilePicPath());
        byte[] pictureFile =  Files.readAllBytes(filePath);

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, Files.probeContentType(filePath));

        return new ResponseEntity<>(pictureFile, headers, HttpStatus.OK);
    }

    @GetMapping("/users/{userId}/banner")
    public ResponseEntity<byte[]> getCenterBanner(@PathVariable Long userId) throws Exception {

        AdoptionCenter user = userService.findAdoptionCenter(userId).orElse(null);

        if(user == null){
            throw new Exception("Center not found!");
        }

        Path filePath = Paths.get(user.getBannerPicPath());
        byte[] pictureFile =  Files.readAllBytes(filePath);

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, Files.probeContentType(filePath));

        return new ResponseEntity<>(pictureFile, headers, HttpStatus.OK);
    }

    @GetMapping("/animals/{animalId}")
    public ResponseEntity<byte[]> getAnimalPic(@PathVariable Long animalId) throws Exception {

        Animal animal = animalService.findAnimal(animalId).orElse(null);

        if(animal == null){
            throw new Exception("Animal not found!");
        }

        Path filePath = Paths.get(animal.getPicPath());
        byte[] pictureFile =  Files.readAllBytes(filePath);

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, Files.probeContentType(filePath));

        return new ResponseEntity<>(pictureFile, headers, HttpStatus.OK);
    }

    @GetMapping("/events/{eventId}")
    public ResponseEntity<byte[]> getEventThumbnail(@PathVariable Long eventID) throws Exception {

        Event event = eventService.findEvent(eventID).orElse(null);

        if(event == null){
            throw new Exception("Event not found!");
        }

        Path filePath = Paths.get(event.getThumbnailPath());
        byte[] pictureFile =  Files.readAllBytes(filePath);

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, Files.probeContentType(filePath));

        return new ResponseEntity<>(pictureFile, headers, HttpStatus.OK);
    }


    @PostMapping("/users/{userId}/profile")
    public ResponseEntity<Object> uploadProfilePic(@PathVariable Long userId, @RequestParam("imageFile") MultipartFile imageFile) throws Exception {
        try{
            imageService.saveProfilePicture(imageFile,userId);
            return new ResponseEntity<>(true, HttpStatus.CREATED);
        }
        catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/users/{userId}/banner")
    public ResponseEntity<Object> uploadCenterBanner(@PathVariable Long userId, @RequestParam("imageFile") MultipartFile imageFile) throws Exception {
        try{
            imageService.saveCenterBanner(imageFile,userId);
            return new ResponseEntity<>(true, HttpStatus.CREATED);
        }
        catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/animals/{animalId}")
    public ResponseEntity<Object> uploadAnimalPic(@PathVariable Long animalId, @RequestParam("imageFile") MultipartFile imageFile) throws Exception {
        try{
            imageService.saveAnimalPicture(imageFile,animalId);
            return new ResponseEntity<>(true, HttpStatus.CREATED);
        }
        catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/events/{eventId}")
    public ResponseEntity<Object> uploadEventThumbnail(@PathVariable Long eventId, @RequestParam("imageFile") MultipartFile imageFile) throws Exception {
        try{
            imageService.saveEventThumbnail(imageFile,eventId);
            return new ResponseEntity<>(true, HttpStatus.CREATED);
        }
        catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

}