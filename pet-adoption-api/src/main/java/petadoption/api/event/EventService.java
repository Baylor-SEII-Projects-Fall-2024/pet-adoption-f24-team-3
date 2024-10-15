package petadoption.api.event;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
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
    public Long saveEvent(Event event) {
        return eventRepository.save(event).getId();
    }

    public Long updateEvent(Event newEvent, Long eventId) {
        Event getEvent = findEvent(eventId).orElseThrow(EntityNotFoundException::new);
        newEvent.setId(eventId);
        newEvent.setDatePosted(getEvent.getDatePosted());
        return eventRepository.save(newEvent).getId();
    }
}

