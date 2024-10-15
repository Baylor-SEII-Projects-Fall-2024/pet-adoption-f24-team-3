package petadoption.api.preferences;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Log4j2
@RestController
@RequestMapping("/api")
public class PreferenceController {
    @Autowired
    private PreferenceService preferenceService;

    @GetMapping("/preferences/")
    public List<Preference> findAllPreferences() {
        return preferenceService.findAllPreferences();
    }

    @GetMapping("/preferences/{userId}")
    public Preference findPreferenceByUserId(@PathVariable Long userId) {
        var preference = preferenceService.findPreferenceByOwnerId(userId).orElse(null);
        if (preference == null) {
            log.warn("Preference not found for user "+userId);
        }
        return preference;
    }

    @PostMapping("/update/preferences/{userId}")
    public Preference updatePreference(@PathVariable Long userId, @RequestBody Preference preference) throws Exception {
        try {
            return preferenceService.updatePreference(userId, preference);
        } catch (Exception e) {
            throw new ResponseStatusException(
                HttpStatus.I_AM_A_TEAPOT, "could not update preferences"
            );
        }
    }

    @PostMapping("/preferences/{potentialOwnerId}")
    public Preference savePreference(@PathVariable Long potentialOwnerId, @RequestBody Preference preference) throws Exception {
        try{
            return  preferenceService.savePreference(potentialOwnerId, preference);
        }catch (Exception e){
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "user not found"
            );
        }
    }
}
