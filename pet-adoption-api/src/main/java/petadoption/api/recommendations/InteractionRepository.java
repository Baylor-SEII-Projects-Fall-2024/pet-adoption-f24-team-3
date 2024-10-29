package petadoption.api.recommendations;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InteractionRepository extends JpaRepository<InteractionHistory, Long> {
    Optional<InteractionHistory> findByUserId(Long userId);
}
