package petadoption.api.animal.responseObjects;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AnimalUniqueTypesResponse {
    List<String> existingSpecies;
    List<String> existingBreeds;
    List<String> existingStates;
}
