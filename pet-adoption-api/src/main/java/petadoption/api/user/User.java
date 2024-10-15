package petadoption.api.user;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Entity
@Getter
@Setter
@Inheritance(strategy = InheritanceType.JOINED) // Strategy for inheritance
@DiscriminatorColumn(name = "user_type") // Discriminator column to identify the type of user
//@Table(name = "`user`") //Used this for testing
public class User {
    public static final String TABLE_NAME = "USERS";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;

    @Column(name = "EMAIL_ADDRESS")
    protected String emailAddress;

    @Column(name = "PASSWORD")
    protected String password;

    @Column(name = "ACCOUNT_TYPE")
    protected String accountType;

    @Column(name = "PROFILE_PIC_PATH")
    protected String profilePicPath;


}