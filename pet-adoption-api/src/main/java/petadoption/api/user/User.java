package petadoption.api.user;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.List;
import java.util.Collection;

@Data
@Entity
@Getter
@Setter
@Inheritance(strategy = InheritanceType.JOINED) // Strategy for inheritance
@DiscriminatorColumn(name = "user_type") // Discriminator column to identify the type of user
//@Table(name = "`user`") //Used this for testing
public class User implements UserDetails {
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

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }
    @Override
    public String getUsername() {
        return emailAddress;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
    @Override
    public boolean isEnabled() {
        return true;
    }
}