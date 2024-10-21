package petadoption.api.event;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EventService {
    @Autowired
    EventRepository eventRepository;

    public List<Event> findAllEvents(){ return eventRepository.findAll();}
    public Optional<Event> findEvent(Long eventId) {
        return eventRepository.findById(eventId);
    }
    public Event saveEvent(Event event) {
        return eventRepository.save(event);
    }

    public Long updateEvent(Event newEvent, Long eventId) {
        Event getEvent = findEvent(eventId).orElseThrow(EntityNotFoundException::new);
        getEvent.setName(newEvent.getName());
        getEvent.setDescription(newEvent.getDescription());
        getEvent.setDateStart(newEvent.getDateStart());
        getEvent.setDateEnd(newEvent.getDateEnd());
        return eventRepository.save(getEvent).getId();
    }
    public List<Event> getEventsByCenterId(Long centerId) { return eventRepository.getEventsByCenterId(centerId); }

    public List<Event> paginateEvents(Integer pageSize, Integer pageNumber) {
        Pageable pagingRequest = PageRequest.of(pageNumber, pageSize);
        return eventRepository.findAll(pagingRequest).getContent();
    }
}

