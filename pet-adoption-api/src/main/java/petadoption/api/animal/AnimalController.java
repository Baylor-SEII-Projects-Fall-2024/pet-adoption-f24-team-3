package petadoption.api.animal;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import petadoption.api.user.AdoptionCenter;
import petadoption.api.user.User;
import petadoption.api.user.UserService;

import java.util.List;

@Log4j2
@RestController
@RequestMapping("/api")
public class AnimalController {
    @Autowired
    private AnimalService animalService;

    @GetMapping("/animals/")
    public List<Animal> findAllAnimals() {
        return animalService.findAllAnimals();
    }

    @GetMapping("/animals/{id}")
    public Animal findAnimalBy(@PathVariable Long id) {
        var animal = animalService.findAnimal(id).orElse(null);
        if (animal == null) {
            log.warn("Animal not found");
        }
        return animal;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("animals/center/{id}")
    public List<Animal> findAnimalsByCenter(@PathVariable Long id) { return animalService.findAnimalsByCenterId(id); }

    @PostMapping("/animals/")
    public Animal saveAnimal(@RequestBody Animal animal) {
        return animalService.saveAnimal(animal);
    }
}