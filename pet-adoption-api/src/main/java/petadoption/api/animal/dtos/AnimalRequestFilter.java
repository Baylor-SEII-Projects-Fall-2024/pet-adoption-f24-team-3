package petadoption.api.animal.dtos;

import lombok.Getter;
import lombok.Setter;
import petadoption.api.animal.AnimalAgeClass;
import petadoption.api.animal.AnimalSex;
import petadoption.api.animal.AnimalSize;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class AnimalRequestFilter {
    private Integer pageSize = 12;
    private List<Long> alreadyDisplayedIds;
    private List<String> species = new ArrayList<>();
    private List<String> breeds = new ArrayList<>();
    private String state;
    private List<AnimalSex> allowedSexes = new ArrayList<>();
    private AnimalSize[] sizeRange = {AnimalSize.EXTRA_SMALL, AnimalSize.EXTRA_LARGE};
    private AnimalAgeClass[] ageClassRange={AnimalAgeClass.BABY,AnimalAgeClass.OLD};
}
