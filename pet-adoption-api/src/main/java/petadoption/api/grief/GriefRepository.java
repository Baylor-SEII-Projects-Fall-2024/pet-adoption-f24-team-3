package petadoption.api.grief;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

/**
 * Repository interface for managing {@link Grief} entities.
 *
 * <p>This interface extends {@link JpaRepository}, providing CRUD operations and custom
 * query methods for {@link Grief} entities. It is responsible for database interactions
 * related to grief data.
 */
public interface GriefRepository extends JpaRepository<Grief, Long> {
    /**
     * Finds a {@link Grief} entity by the potential owner's ID.
     *
     * @param potentialOwnerId the unique identifier of the potential owner.
     * @return an {@link Optional} containing the {@link Grief} entity if found, or an
     *         empty {@link Optional} if no record exists.
     */
    Optional<Grief> findByPotentialOwnerId(Long potentialOwnerId);
}
