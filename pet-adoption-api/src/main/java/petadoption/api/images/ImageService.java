package petadoption.api.images;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import petadoption.api.animal.Animal;
import petadoption.api.animal.AnimalService;
import petadoption.api.event.Event;
import petadoption.api.event.EventService;
import petadoption.api.user.AdoptionCenter;
import petadoption.api.user.User;
import petadoption.api.user.UserService;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;


@Service
public class ImageService {
    @Autowired
    UserService userService;
    @Autowired
    AnimalService animalService;
    @Autowired
    EventService eventService;

    //Specifies the directory at which the images should be saved
    @Value("${upload.directory}")
    private String uploadDirectory;

    public void saveProfilePicture(MultipartFile imageFile, Long userId) throws Exception {
        User user = userService.findUser(userId).orElse(null);
        if(user == null){
            throw new Exception("User not found!");
        }
        Path savedPath = saveImage(imageFile,"users/"+userId,imageFile.getOriginalFilename());
        user.setProfilePicPath(savedPath.toString());

        userService.saveUser(user);
    }

    public boolean deleteProfilePicture(Long userId) throws  Exception{
        User user = userService.findUser(userId).orElse(null);
        if(user == null){
            throw new Exception("User not found!");
        }
        String picPath = user.getProfilePicPath();
        user.setProfilePicPath(null);
        userService.saveUser(user);
        return deleteImage(picPath);
    }

    public void saveCenterBanner(MultipartFile imageFile, Long centerId) throws Exception {
        AdoptionCenter center = userService.findAdoptionCenter(centerId).orElse(null);
        if(center == null){
            throw new Exception("Center not found!");
        }
        Path savedPath = saveImage(imageFile,"users/"+centerId,imageFile.getOriginalFilename());
        center.setBannerPicPath(savedPath.toString());

        userService.saveUser(center);
    }

    public boolean deleteCenterBanner(Long userId) throws  Exception{
        AdoptionCenter center = userService.findAdoptionCenter(userId).orElse(null);
        if(center == null){
            throw new Exception("User not found!");
        }
        String picPath = center.getBannerPicPath();
        center.setBannerPicPath(null);
        userService.saveUser(center);
        return deleteImage(picPath);
    }
    public void saveAnimalPicture(MultipartFile imageFile, Long animalId) throws Exception {
        Animal animal = animalService.findAnimal(animalId).orElse(null);
        if(animal == null){
            throw new Exception("Animal not found!");
        }
        Path savedPath = saveImage(imageFile,"animals/"+animalId,imageFile.getOriginalFilename());
        animal.setPicPath(savedPath.toString());

        animalService.saveAnimal(animal);
    }
    public boolean deleteAnimalPicture(Long animalId) throws  Exception{
        Animal animal = animalService.findAnimal(animalId).orElse(null);
        if(animal == null){
            throw new Exception("Animal not found!");
        }
        String picPath = animal.getPicPath();
        animal.setPicPath(null);
        animalService.saveAnimal(animal);
        return deleteImage(picPath);
    }
    public void saveEventThumbnail(MultipartFile imageFile, Long eventId) throws Exception {
        Event event = eventService.findEvent(eventId).orElse(null);
        if(event == null){
            throw new Exception("Event not found!");
        }
        Path savedPath = saveImage(imageFile,"events/"+eventId,imageFile.getOriginalFilename());
        event.setThumbnailPath(savedPath.toString());

        eventService.saveEvent(event);
    }
    public boolean deleteEventThumbnail(Long eventId) throws  Exception{
        Event event = eventService.findEvent(eventId).orElse(null);
        if(event == null){
            throw new Exception("Event not found!");
        }
        String picPath = event.getThumbnailPath();
        event.setThumbnailPath(null);
        eventService.saveEvent(event);
        return deleteImage(picPath);
    }


    private Path saveImage(MultipartFile imageFile,String directoryName, String fileName) throws IOException {
        Path filePath = Paths.get(uploadDirectory+ File.separator
                + directoryName + File.separator + fileName);

        // Create directories if not exist
        Files.createDirectories(filePath.getParent());

        // Save the file to the server
        Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return filePath;
    }

    private boolean deleteImage(String filePath){
        File deletedFile = new File(filePath);
        if(!deletedFile.exists()) return false;
        return deletedFile.delete();
    }

}

