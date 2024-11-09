package petadoption.api.preferences;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.checkerframework.checker.units.qual.A;
import org.hibernate.annotations.NotFound;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import petadoption.api.animal.Animal;
import petadoption.api.recommendations.RecommendationsService;
import petadoption.api.user.AdoptionCenter;
import petadoption.api.user.PotentialOwner;
import petadoption.api.user.User;
import petadoption.api.user.UserService;
import petadoption.api.user.dtos.CenterDto;
import petadoption.api.user.dtos.PreferenceDto;

import java.util.List;
import java.util.Optional;

@Service
public class PreferenceService {
    @Autowired
    PreferenceRepository preferenceRepository;
    @Autowired
    UserService userService;
    @Autowired
    RecommendationsService recommendationsService;

    public List<Preference> findAllPreferences() {
        return preferenceRepository.findAll();
    }

    public Optional<Preference> findPreference(Long preferenceId) {
        return preferenceRepository.findById(preferenceId);
    }

    public Optional<Preference> findPreferenceByOwnerId(Long userId) {
        return preferenceRepository.findByPotentialOwnerId(userId);
    }

    public Preference updatePreference(Long potentialOwnerId, PreferenceDto preferenceDto) throws Exception {
        Animal oldPreferenceAnimal,newPreferenceAnimal;

        PotentialOwner owner = userService.findPotentialOwner(potentialOwnerId)
                .orElseThrow(() -> new Exception("Owner Not Found"));

        Preference preference = preferenceRepository.findByPotentialOwnerId(potentialOwnerId)
                .orElse(new Preference());

        oldPreferenceAnimal = createAnimalFromPreference(preference);

        // Update preference fields from DTO
        preference.setPotentialOwnerId(owner.getId());
        preference.setSpecies(preferenceDto.getSpecies());
        preference.setBreed(preferenceDto.getBreed());
        preference.setSex(preferenceDto.getSex());
        preference.setAgeClass(preferenceDto.getAgeClass());
        preference.setSize(preferenceDto.getSize());
        preference.setCity(preferenceDto.getCity());
        preference.setState(preferenceDto.getState());

        Preference savedPreference = preferenceRepository.save(preference);

        //use the updated preference to update the user's interaction history
        newPreferenceAnimal = createAnimalFromPreference(preference);
        recommendationsService.editHistoryByPreference(potentialOwnerId,oldPreferenceAnimal,newPreferenceAnimal);

        owner.setPreference(savedPreference);
        userService.saveUser(owner);

        return savedPreference;
    }

    public Preference savePreference(Long potentialOwnerId, Preference preference) throws Exception {
        PotentialOwner owner = userService.findPotentialOwner(potentialOwnerId).orElse(null);

        if (owner == null) {
            throw new Exception("Owner Not Found");
        }

        preference.setPotentialOwnerId(owner.getId());
        Preference savedPreference = preferenceRepository.save(preference);

        owner.setPreference(savedPreference);
        userService.saveUser(owner);

        //update the user's interaction history based on their preference
        Animal preferenceAnimal = createAnimalFromPreference(preference);
        recommendationsService.editHistoryByPreference(potentialOwnerId,null,preferenceAnimal);

        return savedPreference;
    }

    private Animal createAnimalFromPreference(Preference preference){
        Animal preferenceAnimal = new Animal();
        preferenceAnimal.setSpecies(preference.getSpecies());
        preferenceAnimal.setBreed(preference.getBreed());
        preferenceAnimal.setAgeClass(preference.getAgeClass());
        preferenceAnimal.setSex(preference.getSex());
        preferenceAnimal.setSize(preference.getSize());
        return preferenceAnimal;
    }

    // USED TO CLEAR TABLE FOR TESTING: See misc/ClearDataController
    @Transactional
    public void clearData() {
        preferenceRepository.deleteAll();
    }
}
