package petadoption.api.animal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
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

    public List<Animal> findAllAnimals(){ return animalRepository.findAll();}
    public Optional<Animal> findAnimal(Long animalId) {
        return animalRepository.findById(animalId);
    }
    public Animal saveAnimal(Animal animal) {
        return animalRepository.save(animal);
    }
    public List<Animal> findAnimalsByCenterId(Long centerId) { return animalRepository.findAnimalsByCenterId(centerId); }

    public List<Animal> recommendAnimals(Integer pageSize, Integer pageNumber){
        Pageable pagingRequest = PageRequest.of(pageNumber,pageSize);
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
}
