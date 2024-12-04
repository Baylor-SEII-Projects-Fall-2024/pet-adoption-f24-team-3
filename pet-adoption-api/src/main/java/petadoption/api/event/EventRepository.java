package petadoption.api.event;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> getEventsByCenterId(Long centerId);

    @Query("SELECT e FROM Event e " +
            "WHERE (:state IS NULL OR e.state = :state) " +
            "AND (:city IS NULL OR e.city LIKE :city)")
    Page<Event> findByStateAndCity(
            @Param("state") String state,
            @Param("city") String city,
            Pageable pageable);

}
