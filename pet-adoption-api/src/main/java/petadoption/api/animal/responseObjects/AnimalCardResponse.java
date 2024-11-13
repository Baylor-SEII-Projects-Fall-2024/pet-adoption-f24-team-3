package petadoption.api.animal.responseObjects;


import org.springframework.security.core.parameters.P;
import petadoption.api.animal.Animal;
import petadoption.api.animal.AnimalSex;

import java.util.Date;

public class AnimalCardResponse {
    public Long id;
    public Long centerId;
    public Date datePosted;
    public String name;
    public Integer age;
    public String breed;
    public AnimalSex sex;
    public boolean isLiked = false;
    public boolean isDisliked = false;

    public AnimalCardResponse(Animal sourceAnimal){
        this.id=sourceAnimal.getId();
        this.centerId=sourceAnimal.getCenterId();
        this.datePosted=sourceAnimal.getDatePosted();
        this.name=sourceAnimal.getName();
        this.age=sourceAnimal.getAge();
        this.breed=sourceAnimal.getBreed();
        this.sex=sourceAnimal.getSex();
        this.isLiked = sourceAnimal.isLiked;
        this.isDisliked = sourceAnimal.isDisliked;


    }

}
