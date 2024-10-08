package petadoption.api.preferences;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import petadoption.api.animal.AnimalAgeClass;
import petadoption.api.animal.AnimalSex;
import petadoption.api.animal.AnimalSize;



@Data
@Entity
@Getter
@Setter
@EqualsAndHashCode()
public class Preference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "OWNER_ID")
    private Long potentialOwnerId;

    @Column(name = "SPECIES")
    private String species;

    @Column(name = "BREED")
    private String breed;

    @Column(name = "SEX")
    private AnimalSex sex;

    @Column(name = "AGE_CLASS")
    private AnimalAgeClass ageClass;

    @Column(name = "SIZE")
    private AnimalSize size;

    @Column(name = "CITY")
    private String city;

    @Column(name = "STATE")
    private String state;


}