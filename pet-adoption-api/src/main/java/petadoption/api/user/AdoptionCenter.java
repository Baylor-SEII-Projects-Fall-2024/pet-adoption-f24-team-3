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
//@Table(name = AdoptionCenter.TABLE_NAME)
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

//
//@EqualsAndHashCode(callSuper = true)
//@Entity
//@Data
//@DiscriminatorValue("ADOPTION_CENTER") // This defines what value will be in the 'user_type' column for this entity
//@PrimaryKeyJoinColumn(name = "id") // Reuse the User ID as the primary key
//public class AdoptionCenter extends User {
//
//    private String centerName;
//    private String location;
//
//    // Getters and Setters
//    public String getCenterName() {
//        return centerName;
//    }
//
//    public void setCenterName(String centerName) {
//        this.centerName = centerName;
//    }
//
//    public String getLocation() {
//        return location;
//    }
//
//    public void setLocation(String location) {
//        this.location = location;
//    }
//}
