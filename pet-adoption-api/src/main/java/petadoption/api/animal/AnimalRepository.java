package petadoption.api.animal;

import lombok.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnimalRepository extends JpaRepository<Animal, Long> {
    @Override
    @Query("SELECT a from Animal a WHERE a.isAdopted = false")
    @NonNull
    List<Animal> findAll();

    @Query("SELECT a FROM Animal a WHERE a.centerId = :centerId AND a.isAdopted = false")
    List<Animal> findAnimalsByCenterId(Long centerId);

    @Query("SELECT a FROM Animal a WHERE a.id NOT IN :previouslyDisplayedIds and a.isAdopted = false")
    List<Animal> findAllNotRetrieved(List<Long> previouslyDisplayedIds);

    @Query("SELECT a FROM Animal a WHERE a.isAdopted = false ORDER BY a.datePosted DESC")
    Page<Animal> findAllByOrderByDatePostedDesc(Pageable pageable);
}
