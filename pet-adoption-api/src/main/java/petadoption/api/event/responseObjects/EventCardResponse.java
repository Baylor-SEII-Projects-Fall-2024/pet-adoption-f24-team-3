package petadoption.api.event.responseObjects;

import petadoption.api.event.Event;

import java.util.Date;

public class EventCardResponse {
    public Long id;
    public Long centerId;
    public String name;
    public Date datePosted;
    public Date dateStart;
    public Date dateEnd;
    public String city;
    public String state;

    public EventCardResponse(Event sourceEvent) {
        this.id = sourceEvent.getId();
        this.centerId = sourceEvent.getCenterId();
        this.name = sourceEvent.getName();
        this.datePosted = sourceEvent.getDatePosted();
        this.dateStart = sourceEvent.getDateStart();
        this.dateEnd = sourceEvent.getDateEnd();
        this.city = sourceEvent.getCity();
        this.state = sourceEvent.getState();
    }
}
