package petadoption.api.user.dtos;

import lombok.Data;

import petadoption.api.animal.AnimalAgeClass;
import petadoption.api.animal.AnimalSex;
import petadoption.api.animal.AnimalSize;

@Data
public class PreferenceDto {
    private Long userId;
    private String species;
    private String breed;
    private AnimalSex sex;
    private AnimalAgeClass ageClass;
    private AnimalSize size;
    private String city;
    private String state;
}
