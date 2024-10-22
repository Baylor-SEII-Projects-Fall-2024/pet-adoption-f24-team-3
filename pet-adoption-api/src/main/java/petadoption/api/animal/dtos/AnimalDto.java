package petadoption.api.animal.dtos;

import lombok.Data;
import java.util.Date;

import petadoption.api.animal.AnimalSex;
import petadoption.api.animal.AnimalAgeClass;
import petadoption.api.animal.AnimalSize;
import petadoption.api.animal.Animal;

@Data
public class AnimalDto {
    private Long id;
    private Long centerId;
    private Date date;
    private String petName;
    private String species;
    private String breed;
    private AnimalSex sex;
    private AnimalAgeClass age;
    private AnimalSize size;
    private String city;
    private String state;

    public Animal toAnimal() {
        Animal animal = new Animal();

        animal.setId(id);
        animal.setCenterId(centerId);
        animal.setDatePosted(date);
        animal.setName(petName);
        animal.setSpecies(species);
        animal.setBreed(breed);
        animal.setSex(sex);
        animal.setAgeClass(age);
        animal.setSize(size);

        return animal;
    }
}