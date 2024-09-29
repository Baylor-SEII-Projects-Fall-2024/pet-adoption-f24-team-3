package petadoption.api.user;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;


@Data
@Entity
@Getter
@Setter
@PrimaryKeyJoinColumn(name= "id")
@DiscriminatorValue("ADOPTION_CENTER") // Value that indicates this is an AdoptionCenter
@EqualsAndHashCode(callSuper = true)
public class AdoptionCenter extends User{

    @Column(name = "CENTER_NAME")
    private String name;
    @Column(name = "ADDRESS")
    private String address;
    @Column(name = "CITY")
    private String city;
    @Column(name = "STATE")
    private String state;
    @Column(name = "ZIP_CODE")
    private String zipCode;
    @Column(name = "DESCRIPTION")
    private String description;
    @Column(name = "BANNER_PIC_PATH")
    private String bannerPicPath;

}
