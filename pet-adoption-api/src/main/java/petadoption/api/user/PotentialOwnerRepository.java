package petadoption.api.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PotentialOwnerRepository extends JpaRepository<PotentialOwner, Long> {
    Optional<PotentialOwner> findPotentialOwnerByEmailAddress(String emailAddress);
}
