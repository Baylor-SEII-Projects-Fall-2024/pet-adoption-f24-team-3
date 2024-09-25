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
public class User {
    public static final String TABLE_NAME = "USERS";

//    @Id
//    @GeneratedValue(generator = TABLE_NAME + "_GENERATOR")
//    @SequenceGenerator(
//            name = TABLE_NAME + "_GENERATOR",
//            sequenceName = TABLE_NAME + "_SEQUENCE"
//    )
//    @Column(name = "USER_ID")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(name = "EMAIL_ADDRESS")
    String emailAddress;

    @Column(name = "PASSWORD")
    String password;

    @Column(name = "ACCOUNT_TYPE")
    String accountType;

    @Column(name = "PROFILE_PIC_PATH")
    String profilePicPath;

}

//@Data
//@Entity
//@Getter
//@Setter
//@Inheritance(strategy = InheritanceType.JOINED)
//@DiscriminatorColumn(name = "user_type") // Discriminator column for identifying the type of user
//public class User {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(name = "EMAIL_ADDRESS")
//    String emailAddress;
//
//    @Column(name = "PASSWORD")
//    String password;
//
//    @Column(name = "USER_TYPE")
//    String userType;
//
//    @Column(name = "PROFILE_PIC_PATH")
//    String profilePicPath;
//
//}
