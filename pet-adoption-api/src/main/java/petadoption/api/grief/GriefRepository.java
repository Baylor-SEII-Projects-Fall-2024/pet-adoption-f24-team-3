package petadoption.api.grief;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface GriefRepository extends JpaRepository<Grief, Long> {
    Optional<Grief> findByPotentialOwnerId(Long potentialOwnerId);
}
