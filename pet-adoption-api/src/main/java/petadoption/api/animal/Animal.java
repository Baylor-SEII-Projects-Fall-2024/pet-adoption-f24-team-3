package petadoption.api.animal;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import petadoption.api.user.AdoptionCenter;

import java.util.Date;

@Data
@Entity
@Getter
@Setter
@EqualsAndHashCode()
public class Animal {
    public static final String TABLE_NAME = "ANIMALS";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name="CENTER_ID")
    private Long centerId;

    @Column(name = "DATE_POSTED")
    private Date datePosted;

    @Column(name = "NAME")
    private String name;

    @Column(name = "AGE")
    private Integer age;

    @Column(name = "SPECIES")
    private String species;

    @Column(name = "BREED")
    private String breed;

    @Column(name = "SEX")
    private boolean sex;

    @Column(name = "PIC_PATH")
    private String picPath;

    @Column(name = "DESCRIPTION")
    private String description;

    @Column(name = "SIZE")
    private AnimalSize size;

    @Column(name = "HEIGHT")
    private Integer height;

    @Column(name = "WEIGHT")
    private Integer weight;

}