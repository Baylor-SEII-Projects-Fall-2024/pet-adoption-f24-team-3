package petadoption.api.user.responseObjects;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import petadoption.api.user.AdoptionCenter;

@Getter
public class AdoptionCenterCardResponse {
    @JsonProperty
    private Long id;
    @JsonProperty
    private String name;
    @JsonProperty
    private String address;
    @JsonProperty
    private String state;
    @JsonProperty
    private String city;

    public AdoptionCenterCardResponse(AdoptionCenter sourceCenter) {
        this.id = sourceCenter.getId();
        this.name = sourceCenter.getName();
        this.address = sourceCenter.getAddress();
        this.state = sourceCenter.getState();
        this.city = sourceCenter.getCity();
    }
}
