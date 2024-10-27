package petadoption.api.animal;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import petadoption.api.event.Event;
import petadoption.api.images.ImageService;

import java.util.List;
import java.util.Optional;

@Service
public class AnimalService {
    @Autowired
    AnimalRepository animalRepository;
    ImageService imageService;

    //only creates the image service when it needs it - prevents cyclical loading
    public AnimalService(@Lazy ImageService imageService) {
        super();
        this.imageService = imageService;
    }

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

    public void deleteAnimal(Long animalId) throws Exception{
        Animal deletedAnimal = animalRepository.findById(animalId).orElse(null);
        if(deletedAnimal == null){

            throw new Exception("Animal not found!");
        }
        if(deletedAnimal.getPicPath() !=null) {
            imageService.deleteAnimalPicture(animalId);
        }
        animalRepository.delete(deletedAnimal);
    }

    public Long updateAnimal(Animal newAnimal, Long id) {
        Animal animal = findAnimal(id).orElseThrow(EntityNotFoundException::new);
        if(newAnimal.getName() != null && !newAnimal.getName().isEmpty()) {
            animal.setName(newAnimal.getName());
        }
        if(newAnimal.getAge() != null && newAnimal.getAge()>0){
            animal.setAge(newAnimal.getAge());
        }
        if(newAnimal.getSpecies() != null && !newAnimal.getSpecies().isEmpty()) {
            animal.setSpecies(newAnimal.getSpecies());
        }
        if(newAnimal.getBreed() != null && !newAnimal.getBreed().isEmpty()) {
            animal.setBreed(newAnimal.getBreed());
        }
        if(newAnimal.getSex() != null){
            animal.setSex(newAnimal.getSex());
        }
        if(newAnimal.getWeight() != null && newAnimal.getWeight()>0){
            animal.setWeight(newAnimal.getWeight());
        }
        if(newAnimal.getHeight() != null && newAnimal.getHeight()>0){
            animal.setHeight(newAnimal.getHeight());
        }
        if(newAnimal.getAgeClass() != null){
            animal.setAgeClass(newAnimal.getAgeClass());
        }
        if(newAnimal.getDescription() != null && !newAnimal.getDescription().isEmpty()) {
            animal.setDescription(newAnimal.getDescription());
        }
        if(newAnimal.getSize() != null){
            animal.setSize(newAnimal.getSize());
        }

        return animalRepository.save(animal).getId();
    }
}
