package petadoption.api.user.responseObjects;

import petadoption.api.user.AdoptionCenter;

public class CenterCardResponse {
    Long id;
    String name;
    String address;
    String state;
    String city;

    public CenterCardResponse(AdoptionCenter sourceCenter) {
        this.id = sourceCenter.getId();
        this.name = sourceCenter.getName();
        this.address = sourceCenter.getAddress();
        this.state = sourceCenter.getState();
        this.city = sourceCenter.getCity();
    }
}
