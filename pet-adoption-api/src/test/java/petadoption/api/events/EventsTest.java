package petadoption.api.events;

import jakarta.transaction.Transactional;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import petadoption.api.event.Event;
import petadoption.api.event.EventRepository;
import petadoption.api.event.EventService;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("testdb") // make these tests use the H2 in-memory DB instead of your actual DB
@Transactional
public class EventsTest {
    @Autowired
    private EventService eventService;

    private Event event;

    @BeforeEach
    void testCreateEvent(){
        event = new Event();
        Date date = new Date();
        event.setCenterId(1L);
        event.setDatePosted(date); // Current date
        event.setName("Test Event");
        event.setDescription("Test Description");
        date.setTime(2000);
        event.setDateStart(date);
        date.setTime(2000);
        event.setDateEnd(date.toString());
        assertEquals(event, eventService.saveEvent(event));
    }
    @AfterEach
    void testDeleteEvent(){
        try {
            eventService.deleteEvent(event.getId());
        } catch (Exception e) {
            fail("Exception thrown" + e.getMessage());
        }
        assertTrue(eventService.findEvent(event.getId()).isEmpty());
    }

    @Test
    void testFindAllEvents(){
        assertFalse(eventService.findAllEvents().isEmpty());
    }

    @Test
    void testFindEventByCenterId(){
        assertFalse(eventService.getEventsByCenterId(event.getCenterId()).isEmpty());
    }

    @Test
    void testFindEventById(){
        assertFalse(eventService.findEvent(event.getId()).isEmpty());
    }

    @Test
    void testUpdateEvent(){
        event.setName("Test Updated");
        assertEquals(event.getId(), eventService.updateEvent(event, event.getId()));
    }



}
