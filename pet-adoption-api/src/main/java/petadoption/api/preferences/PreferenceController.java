package petadoption.api.preferences;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

import petadoption.api.user.dtos.PreferenceDto;
import petadoption.api.annotation.GlobalCrossOrigin;

@Log4j2
@RestController
@RequestMapping("/api")
@GlobalCrossOrigin
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
            log.warn("Preference not found for user " + userId);
        }
        return preference;
    }

    @PostMapping("/update/preferences/{id}")
    public ResponseEntity<Map<String, Object>> updatePreference(@RequestBody PreferenceDto preferenceDto,
            @PathVariable Long id) {
        try {
            Preference updatedPreference = preferenceService.updatePreference(id, preferenceDto);
            Map<String, Object> response = new HashMap<>();
            response.put("preference", updatedPreference);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Update preference failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/preferences/{potentialOwnerId}")
    public Preference savePreference(@PathVariable Long potentialOwnerId, @RequestBody Preference preference)
            throws Exception {
        try {
            return preferenceService.savePreference(potentialOwnerId, preference);
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "user not found");
        }
    }
}
