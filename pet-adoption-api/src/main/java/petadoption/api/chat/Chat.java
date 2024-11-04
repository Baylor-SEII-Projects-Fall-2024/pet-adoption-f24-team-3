package petadoption.api.chat;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Data
@Entity
@Getter
@Setter
@EqualsAndHashCode
public class Chat {
    public static final String TABLE_NAME = "CHATS";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;

    @Column(name = "USER_ID_FIRST")
    protected Long userIDFirst;

    @Column(name = "USER_ID_SECOND")
    protected Long userIDSecond;

    @Column(name = "LAST_UPDATED")
    protected Date lastUpdated;

}
