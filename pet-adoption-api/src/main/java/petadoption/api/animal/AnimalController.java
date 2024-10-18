package petadoption.api.animal;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import petadoption.api.animal.responseObjects.AnimalCardResponse;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Log4j2
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
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

    @GetMapping("/recommend")
    public List<AnimalCardResponse> recommendAnimals(@RequestParam("pageSize") Integer pageSize, @RequestParam("pageNumber") Integer pageNumber){
        List<Animal> animals =  animalService.recommendAnimals(pageSize,pageNumber);
        return animals.stream().map(AnimalCardResponse::new).collect(Collectors.toList());
    }

    @GetMapping("/center/{id}")
    public List<AnimalCardResponse> findAnimalsByCenter(@PathVariable Long id) {
        List<Animal> animals =  animalService.findAnimalsByCenterId(id);
        return animals.stream().map(AnimalCardResponse::new).collect(Collectors.toList());
    }

    @PostMapping("/")
    public Animal saveAnimal(@RequestBody Animal animal) {
        return animalService.saveAnimal(animal);
    }
}