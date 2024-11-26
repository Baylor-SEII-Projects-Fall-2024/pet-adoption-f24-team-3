package petadoption.api.animal.customFilterRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.stereotype.Repository;
import petadoption.api.animal.Animal;
import petadoption.api.animal.dtos.AnimalRequestFilter;

import java.util.ArrayList;
import java.util.List;

//Custom Query builder for filtering Animals
@Repository
public class AnimalRepoCustomImpl implements AnimalRepoCustom {

    @PersistenceContext
    private EntityManager entityManager;


    @Override
    public List<Animal> findAllByFilter(AnimalRequestFilter filter) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Animal> query = cb.createQuery(Animal.class);
        Root<Animal> animal = query.from(Animal.class);

        List<Predicate> predicates = new ArrayList<>();

        // Filter by species
        if (filter.getSpecies() != null && !filter.getSpecies().isEmpty()) {
            predicates.add(animal.get("species").in(filter.getSpecies()));
        }

        // Filter by breeds
        if (filter.getBreeds() != null && !filter.getBreeds().isEmpty()) {
            predicates.add(animal.get("breed").in(filter.getBreeds()));
        }

        // Filter by state
        if (filter.getState() != null && !filter.getState().isEmpty()) {
            predicates.add(cb.equal(animal.get("state"), filter.getState()));
        }

        // Filter by allowed sexes
        if (filter.getAllowedSexes() != null && !filter.getAllowedSexes().isEmpty()) {
            predicates.add(animal.get("sex").in(filter.getAllowedSexes()));
        }

        // Filter by size range
        if (filter.getSizeRange() != null && filter.getSizeRange().length == 2) {
            predicates.add(cb.between(animal.get("size"), filter.getSizeRange()[0], filter.getSizeRange()[1]));
        }

        // Filter by age class range
        if (filter.getAgeClassRange() != null && filter.getAgeClassRange().length == 2) {
            predicates.add(cb.between(animal.get("ageClass"), filter.getAgeClassRange()[0], filter.getAgeClassRange()[1]));
        }

        // Exclude adopted animals
        predicates.add(cb.equal(animal.get("adopted"), false));

        // Exclude already displayed IDs
        if (filter.getAlreadyDisplayedIds() != null && !filter.getAlreadyDisplayedIds().isEmpty()) {
            predicates.add(animal.get("id").in(filter.getAlreadyDisplayedIds()).not());
        }

        query.select(animal).where(predicates.toArray(new Predicate[0]));

        return entityManager.createQuery(query)
                .setMaxResults(filter.getPageSize())
                .getResultList();
    }
}
