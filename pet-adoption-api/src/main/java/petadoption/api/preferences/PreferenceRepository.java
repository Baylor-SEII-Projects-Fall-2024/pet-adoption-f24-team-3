package petadoption.api.preferences;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PreferenceRepository extends JpaRepository<Preference, Long> {

    public Optional<Preference> findByPotentialOwnerId(Long potentialOwnerId);
}
