package petadoption.api.animal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AnimalService {
    @Autowired
    AnimalRepository animalRepository;

    public List<Animal> findAllAnimals() {
        return animalRepository.findAll();
    }

    public Optional<Animal> findAnimal(Long animalId) {
        return animalRepository.findById(animalId);
    }

    public Animal saveAnimal(Animal animal) {
        return animalRepository.save(animal);
    }

    public List<Animal> findAnimalsByCenterId(Long centerId) {
        return animalRepository.findAnimalsByCenterId(centerId);
    }

    public List<Animal> recommendAnimals(Integer pageSize, Integer pageNumber) {
        Pageable pagingRequest = PageRequest.of(pageNumber, pageSize);
        return animalRepository.findAll(pagingRequest).getContent();
    }
}
