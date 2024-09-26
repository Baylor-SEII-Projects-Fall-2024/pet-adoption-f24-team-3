package petadoption.api.animal;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import petadoption.api.user.User;

@Repository
public interface AnimalRepository extends JpaRepository<Animal, Long> {

}
