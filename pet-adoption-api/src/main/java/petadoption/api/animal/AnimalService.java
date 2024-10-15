package petadoption.api.animal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AnimalService {
    @Autowired
    AnimalRepository animalRepository;

    public List<Animal> findAllAnimals(){ return animalRepository.findAll();}
    public Optional<Animal> findAnimal(Long animalId) {
        return animalRepository.findById(animalId);
    }
    public Animal saveAnimal(Animal animal) {
        return animalRepository.save(animal);
    }
    public List<Animal> findAnimalsByCenterId(Long centerId) { return animalRepository.findAnimalsByCenterId(centerId); }
}
