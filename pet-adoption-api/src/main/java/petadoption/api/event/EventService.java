package petadoption.api.event;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import petadoption.api.animal.Animal;
import petadoption.api.images.ImageService;

import java.util.List;
import java.util.Optional;

@Service
public class EventService {
    @Autowired
    EventRepository eventRepository;

    ImageService imageService;

    //only creates the image service when it needs it - prevents cyclical loading
    public EventService(@Lazy ImageService imageService) {
        super();
        this.imageService = imageService;
    }

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
    public void deleteEvent(Long eventId) throws Exception{
        Event deletedEvent = eventRepository.findById(eventId).orElse(null);
        if(deletedEvent == null){

            throw new Exception("Animal not found!");
        }
        if(deletedEvent.getThumbnailPath() !=null) {
            imageService.deleteAnimalPicture(eventId);
        }
        eventRepository.delete(deletedEvent);
    }
}

