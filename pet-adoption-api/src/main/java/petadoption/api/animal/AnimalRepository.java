package petadoption.api.animal;

import lombok.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import petadoption.api.animal.customFilterRepository.AnimalRepoCustom;

import java.util.List;

@Repository
public interface AnimalRepository extends JpaRepository<Animal, Long>, AnimalRepoCustom {
    @Override
    @Query("SELECT a from Animal a WHERE a.adopted = false")
    @NonNull
    List<Animal> findAll();

    @Query("SELECT a FROM Animal a WHERE a.centerId = :centerId AND a.adopted = false")
    List<Animal> findAnimalsByCenterId(Long centerId);

    @Query("SELECT a from Animal a where a.centerId = :centerId AND a.adopted = true")
    List<Animal> findAdoptedAnimalsByCenterId(Long centerId);

    @Query("SELECT a FROM Animal a WHERE a.adopted = false ORDER BY a.datePosted DESC")
    Page<Animal> findAllByOrderByDatePostedDesc(Pageable pageable);

    @Query("SELECT DISTINCT a.species FROM Animal a WHERE a.adopted = false ORDER BY a.species")
    List<String> findDistinctSpecies();
    @Query("SELECT DISTINCT a.breed FROM Animal a WHERE a.adopted = false ORDER BY a.breed")
    List<String> findDistinctBreeds();
    @Query("SELECT DISTINCT a.state FROM Animal a WHERE a.adopted = false ORDER BY a.state")
    List<String> findDistinctStates();
}
