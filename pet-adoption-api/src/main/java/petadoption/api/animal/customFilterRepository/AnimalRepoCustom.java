package petadoption.api.animal.customFilterRepository;

import petadoption.api.animal.Animal;
import petadoption.api.animal.dtos.AnimalRequestFilter;

import java.util.List;

public interface AnimalRepoCustom {
    List<Animal> findAllByFilter(AnimalRequestFilter filter);
}
