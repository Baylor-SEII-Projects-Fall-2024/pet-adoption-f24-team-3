package petadoption.api.event;

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
    public Event saveEvent(Event event) {
        return eventRepository.save(event);
    }
}

