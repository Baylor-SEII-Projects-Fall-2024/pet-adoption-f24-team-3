package petadoption.api.user;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.util.Objects;


@Data
@Entity
@Getter
@Setter
@PrimaryKeyJoinColumn(name= "id")
@DiscriminatorValue("ADOPTION_CENTER") // Value that indicates this is an AdoptionCenter
@EqualsAndHashCode(callSuper = true)
public class AdoptionCenter extends User{

    @Column(name = "CENTER_NAME")
    String name;
    @Column(name = "ADDRESS")
    String address;
    @Column(name = "CITY")
    String city;
    @Column(name = "STATE")
    String state;
    @Column(name = "ZIP_CODE")
    String zipCode;
    @Column(name = "DESCRIPTION")
    String description;
    @Column(name = "BANNER_PIC_PATH")
    String bannerPicPath;

}
