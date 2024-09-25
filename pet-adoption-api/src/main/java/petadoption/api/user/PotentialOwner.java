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
//@Table(name = PotentialOwner.TABLE_NAME)
@PrimaryKeyJoinColumn(name= "id")
@DiscriminatorValue("POTENTIAL_OWNER") // Indicates for inheritence that this is a potential owner
@EqualsAndHashCode(callSuper = true)
public class PotentialOwner extends User{
    @Column(name = "NAME_FIRST")
    String nameFirst;
    @Column(name = "NAME_LAST")
    String nameLast;
}
