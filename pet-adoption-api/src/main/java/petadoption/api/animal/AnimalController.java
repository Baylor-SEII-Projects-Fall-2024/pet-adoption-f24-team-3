package petadoption.api.animal;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.animal.responseObjects.AnimalCardResponse;
import petadoption.api.annotation.GlobalCrossOrigin;
import petadoption.api.user.dtos.OwnerDto;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Log4j2
@RestController
@RequestMapping("/api/animals")
@GlobalCrossOrigin
public class AnimalController {
    @Autowired
    private AnimalService animalService;

    @GetMapping("/")
    public List<Animal> findAllAnimals() {
        return animalService.findAllAnimals();
    }
    @GetMapping("/{id}")
    public Animal findAnimalBy(@PathVariable Long id) {
        var animal = animalService.findAnimal(id).orElse(null);
        if (animal == null) {
            log.warn("Animal not found");
        }
        return animal;
    }
    @PutMapping("/{id}")
        public ResponseEntity<Object> updateAnimal(@RequestBody Animal animal, @PathVariable Long id) {
        Long updatedPet = animalService.updateAnimal(animal, id);
//        Map<String, Object>  response = new HashMap<>();
        if (updatedPet!=null) {
//            response.put("petid", updatedPet);
            return ResponseEntity.ok(updatedPet);
        } else {
//            response.put("message", "Update failed.");
            return new ResponseEntity<Object>(null, HttpStatus.BAD_REQUEST);// Return error message as JSON
        }
    }

    @PostMapping("/recommend")
    public ResponseEntity<List<AnimalCardResponse>> recommendAnimals(@RequestParam("pageSize") Integer pageSize,@RequestParam Long userId,
            @RequestBody List<Long> alreadyDisplayedIds) {
        try {
            List<Animal> animals = animalService.recommendAnimals(pageSize, alreadyDisplayedIds, userId);
            List<AnimalCardResponse> responses =  animals.stream().map(AnimalCardResponse::new).collect(Collectors.toList());
            return new ResponseEntity<>(responses,HttpStatus.OK);
        }
        catch(Exception e){
            log.error(e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(null,HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/center/{id}")
    public List<AnimalCardResponse> findAnimalsByCenter(@PathVariable Long id) {
        List<Animal> animals = animalService.findAnimalsByCenterId(id);
        return animals.stream().map(AnimalCardResponse::new).collect(Collectors.toList());
    }

    @GetMapping("/centerAdopted/{id}")
    public List<AnimalCardResponse> findAdoptedAnimalsByCenter(@PathVariable Long id) {
        List<Animal> animals = animalService.findAdoptedAnimalsByCenterId(id);
        return animals.stream().map(AnimalCardResponse::new).collect(Collectors.toList());
    }

    @PostMapping("/updateAdoptStatus/{id}")
    public ResponseEntity<Object> updateAdoptStatus(@PathVariable Long id, @RequestParam Boolean status) {
        try {
            animalService.updateAdoptStatus(id, status);
            return new ResponseEntity<>(true, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Unable to update adoption status: {}", e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/")
    public Animal saveAnimal(@RequestBody Animal animal) {
        return animalService.saveAnimal(animal);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteAnimal(@PathVariable Long id) {
        try {
            animalService.deleteAnimal(id);
            return new ResponseEntity<>(true, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Unable to delete Animal:" + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
