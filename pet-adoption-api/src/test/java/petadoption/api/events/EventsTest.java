package petadoption.api.events;

import jakarta.transaction.Transactional;
import org.checkerframework.checker.units.qual.A;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import petadoption.api.event.Event;
import petadoption.api.event.EventRepository;
import petadoption.api.event.EventService;
import petadoption.api.user.AdoptionCenter;
import petadoption.api.user.UserService;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("testdb") // make these tests use the H2 in-memory DB instead of your actual DB
@Transactional
public class EventsTest {
    @Autowired
    private EventService eventService;
    @Autowired
    private UserService userService;

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
        event.setDateEnd(date);
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

    @Test
    void testEventLocations(){
        //create a center that has an address
        AdoptionCenter center = new AdoptionCenter();
        center.setName("CENTER");
        center.setAddress("ADDRESS");
        center.setCity("CITY");
        center.setState("STATE");

        center = (AdoptionCenter) userService.saveUser(center);
        assertNotNull(center.getId());
        assertEquals(center.getAddress(),"ADDRESS");
        assertEquals(center.getCity(),"CITY");
        assertEquals(center.getState(),"STATE");

        //first, check that the event will fall back to the center's address if none is given
        event.setCenterId(center.getId());
        event = eventService.saveEvent(event);

        assertNotNull(event.getId());
        assertEquals(event.getAddress(),center.getAddress());
        assertEquals(event.getCity(),center.getCity());
        assertEquals(event.getState(),center.getState());

        //test updating an existing center
        event.setAddress("ADDRESS2");
        event.setCity("CITY2");
        event.setState("STATE2");
        Long eventID = eventService.updateEvent(event,event.getId());

        event = eventService.findEvent(eventID).orElse(null);
        assertNotNull(event);
        assertEquals(event.getAddress(),"ADDRESS2");
        assertEquals(event.getCity(),"CITY2");
        assertEquals(event.getState(),"STATE2");

        //finally, test creating a new event with a specified address
        Event newEvent = new Event();
        newEvent.setName("Second Event");
        newEvent.setAddress("ADDRESS3");
        newEvent.setCity("CITY3");
        newEvent.setState("STATE3");

        newEvent = eventService.saveEvent(newEvent);
        assertNotNull(newEvent);
        assertNotNull(newEvent.getId());
        assertEquals(newEvent.getAddress(),"ADDRESS3");
        assertEquals(newEvent.getCity(),"CITY3");
        assertEquals(newEvent.getState(),"STATE3");




    }



}
