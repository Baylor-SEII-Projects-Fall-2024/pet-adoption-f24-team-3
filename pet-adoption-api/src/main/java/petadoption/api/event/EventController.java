package petadoption.api.event;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.user.dtos.CenterDto;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Log4j2
@RestController
@RequestMapping("/api")
public class EventController {
    @Autowired
    private EventService eventService;

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/events/")
    public List<Event> findAllEvents() {
        return eventService.findAllEvents();
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/events/{id}")
    public Event findEventBy(@PathVariable Long id) {
        var event = eventService.findEvent(id).orElse(null);
        if (event == null) {
            log.warn("Event not found");
        }
        return event;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/events")
    public ResponseEntity<Map<String, Object>> saveEvent(@RequestBody Event newEvent) {
        Long newEventId = eventService.saveEvent(newEvent);
        Map<String, Object>  response = new HashMap<>();

        if (newEventId!=null) {
            response.put("eventID", newEventId);
            return ResponseEntity.ok(response); // Return success message as JSON
        } else {
            response.put("message", "Event creation failed.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response); // Return error message as JSON
        }
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/events/update/{eventId}")
    public ResponseEntity<Map<String, Object>> updateEventInfo(@PathVariable Long eventId, @RequestBody Event newEvent) {
        Long updatedEvent = eventService.updateEvent(newEvent, eventId);
        Map<String, Object> response = new HashMap<>();
        if (updatedEvent != null) {
            response.put("eventID", updatedEvent);
            return ResponseEntity.ok(response); // Return success message as JSON
        } else {
            response.put("message", "Event update failed.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response); // Return error message as JSON
        }
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/events/center/{centerId}")
    public List<Event> getEventsByCenterId(@PathVariable Long centerId) { return eventService.getEventsByCenterId(centerId); }


}