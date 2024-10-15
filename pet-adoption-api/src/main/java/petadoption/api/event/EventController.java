package petadoption.api.event;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Log4j2
@RestController
@RequestMapping("/api")
public class EventController {
    @Autowired
    private EventService eventService;

    @GetMapping("/events/")
    public List<Event> findAllEvents() {
        return eventService.findAllEvents();
    }

    @GetMapping("/events/{id}")
    public Event findEventBy(@PathVariable Long id) {
        var event = eventService.findEvent(id).orElse(null);
        if (event == null) {
            log.warn("Event not found");
        }
        return event;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/events/center/{centerId}")
    public List<Event> getEventsByCenterId(@PathVariable Long centerId) { return eventService.getEventsByCenterId(centerId); }

    @PostMapping("/events/")
    public Event saveEvent(@RequestBody Event event) {
        return eventService.saveEvent(event);
    }
}