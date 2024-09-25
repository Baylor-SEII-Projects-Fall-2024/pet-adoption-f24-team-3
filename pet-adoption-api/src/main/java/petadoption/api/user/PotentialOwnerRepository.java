package petadoption.api.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PotentialOwnerRepository extends JpaRepository<PotentialOwner, Long> {

}