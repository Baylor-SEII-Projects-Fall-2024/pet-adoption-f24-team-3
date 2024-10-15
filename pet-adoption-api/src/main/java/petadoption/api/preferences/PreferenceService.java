package petadoption.api.preferences;

import jakarta.transaction.Transactional;
import org.hibernate.annotations.NotFound;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import petadoption.api.user.PotentialOwner;
import petadoption.api.user.User;
import petadoption.api.user.UserService;
import petadoption.api.user.dtos.PreferenceDto;

import java.util.List;
import java.util.Optional;

@Service
public class PreferenceService {
    @Autowired
    PreferenceRepository preferenceRepository;
    @Autowired
    UserService userService;

    public List<Preference> findAllPreferences(){ return preferenceRepository.findAll();}
    public Optional<Preference> findPreference(Long preferenceId) {
        return preferenceRepository.findById(preferenceId);
    }

    public Optional<Preference> findPreferenceByOwnerId(Long userId) {
        return preferenceRepository.findByPotentialOwnerId(userId);
    }

    public Preference updatePreference(Preference preference, Long potentialOwnerId) throws Exception {
        PotentialOwner owner = userService.findPotentialOwner(potentialOwnerId).orElse(null);

        if(owner == null) {
            throw new Exception("Owner Not Found");
        }

        preference.setPotentialOwnerId(owner.getId());

        Preference updatePreference = preferenceRepository.save(preference); // should this be an update call?

        owner.setPreference(updatePreference);
        userService.saveUser(owner); // should we have an updateUser

        return updatePreference;
    }

    public Preference savePreference(Long potentialOwnerId, Preference preference) throws Exception {
        PotentialOwner owner = userService.findPotentialOwner(potentialOwnerId).orElse(null);

        if(owner == null){
            throw new Exception("Owner Not Found");
        }

        preference.setPotentialOwnerId(owner.getId());


        Preference savedPreference = preferenceRepository.save(preference);

        owner.setPreference(savedPreference);
        userService.saveUser(owner);

        return savedPreference;
    }

    // USED TO CLEAR TABLE FOR TESTING: See misc/ClearDataController
    @Transactional
    public void clearData() {
        preferenceRepository.deleteAll();
    }
}
