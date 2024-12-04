package petadoption.api.event;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.annotation.GlobalCrossOrigin;
import petadoption.api.event.responseObjects.EventCardResponse;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Log4j2
@RestController
@RequestMapping("/api/events")
@GlobalCrossOrigin
public class EventController {
    @Autowired
    private EventService eventService;

    @GetMapping("/")
    public List<Event> findAllEvents() {
        return eventService.findAllEvents();
    }

    @GetMapping("/{id}")
    public Event findEventBy(@PathVariable Long id) {
        var event = eventService.findEvent(id).orElse(null);
        if (event == null) {
            log.warn("Event not found");
        }
        return event;
    }

    @PostMapping("/")
    public ResponseEntity<Map<String, Object>> saveEvent(@RequestBody Event newEvent) {
        Long newEventId = eventService.saveEvent(newEvent).getId();
        Map<String, Object> response = new HashMap<>();

        if (newEventId != null) {
            response.put("eventID", newEventId);
            return ResponseEntity.ok(response); // Return success message as JSON
        } else {
            response.put("message", "Event creation failed.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response); // Return error message as
                                                                                           // JSON
        }
    }

    @PostMapping("/update/{eventId}")
    public ResponseEntity<Map<String, Object>> updateEventInfo(@PathVariable Long eventId,
            @RequestBody Event newEvent) {
        Long updatedEvent = eventService.updateEvent(newEvent, eventId);
        Map<String, Object> response = new HashMap<>();
        if (updatedEvent != null) {
            response.put("eventID", updatedEvent);
            return ResponseEntity.ok(response); // Return success message as JSON
        } else {
            response.put("message", "Event update failed.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response); // Return error message as
                                                                                           // JSON
        }
    }

    @GetMapping("/center/{centerId}")
    public List<Event> getEventsByCenterId(@PathVariable Long centerId) {
        return eventService.getEventsByCenterId(centerId);
    }

    @GetMapping("/paginated")
    public List<EventCardResponse> findByPage(@RequestParam("pageSize") Integer pageSize,
            @RequestParam("pageNumber") Integer pageNumber) {
        List<Event> events = eventService.paginateEvents(pageSize, pageNumber);
        return events.stream().map(EventCardResponse::new).collect(Collectors.toList());
    }

    @GetMapping("/paginated/sort")
    public List<EventCardResponse> findByPageSort(
            @RequestParam("pageSize") Integer pageSize,
            @RequestParam("pageNumber") Integer pageNumber,
            @RequestParam(value = "state", required = false) String state,
            @RequestParam(value = "city", required = false) String city) {


        List<Event> events = eventService.paginateEvents(pageSize, pageNumber, state, city);

        return events.stream().map(EventCardResponse::new).collect(Collectors.toList());
    }



    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteEvent(@PathVariable Long id) {
        try {
            eventService.deleteEvent(id);
            return new ResponseEntity<>(true, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Unable to delete Event:" + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

}
