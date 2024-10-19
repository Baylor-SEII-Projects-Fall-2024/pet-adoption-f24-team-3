package petadoption.api.animal;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnimalRepository extends JpaRepository<Animal, Long> {
    List<Animal> findAnimalsByCenterId(Long centerId);

    Page<Animal> findAllByOrderByDatePostedDesc(Pageable pageable);
}
