package petadoption.api.preferences;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import petadoption.api.user.PotentialOwner;
import petadoption.api.user.UserService;

import java.util.List;
import java.util.Optional;

@Service
public class PreferenceService {
    @Autowired
    PreferenceRepository preferenceRepository;
    @Autowired
    UserService userService;

    public List<Preference> findAllPreferences() {
        return preferenceRepository.findAll();
    }

    public Optional<Preference> findPreference(Long preferenceId) {
        return preferenceRepository.findById(preferenceId);
    }

    public Optional<Preference> findPreferenceByOwnerId(Long userId) {
        return preferenceRepository.findByPotentialOwnerId(userId);
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

        return savedPreference;
    }
}
