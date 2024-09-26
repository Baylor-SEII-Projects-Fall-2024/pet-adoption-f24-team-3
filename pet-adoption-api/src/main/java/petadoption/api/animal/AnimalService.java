package petadoption.api.animal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import petadoption.api.user.*;

import java.util.List;
import java.util.Optional;

@Service
public class AnimalService {
    @Autowired
    AnimalRepository animalRepository;
    @Autowired
    UserService userService;


    public List<Animal> findAllAnimals(){ return animalRepository.findAll();}
    public Optional<Animal> findAnimal(Long userId) {
        return animalRepository.findById(userId);
    }
    public Animal saveAnimal(Animal animal) {
        return animalRepository.save(animal);
    }
}
