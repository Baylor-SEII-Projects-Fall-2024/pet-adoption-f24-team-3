package petadoption.api.user.responseObjects;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import petadoption.api.user.AdoptionCenter;

@Getter
public class AdoptionCenterCardResponse {
    public Long id;
    public String name;
    public String address;
    public String state;
    public String city;
    public String description;
    public String zipCode;


    public AdoptionCenterCardResponse(AdoptionCenter sourceCenter) {
        this.id = sourceCenter.getId();
        this.name = sourceCenter.getName();
        this.address = sourceCenter.getAddress();
        this.state = sourceCenter.getState();
        this.city = sourceCenter.getCity();
        this.zipCode = sourceCenter.getZipCode();
        this.description = sourceCenter.getDescription();
    }
}
