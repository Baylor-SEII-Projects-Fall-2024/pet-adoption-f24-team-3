package petadoption.api.chat;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Entity
@Getter
@Setter
public class Chat {
    public static final String TABLE_NAME = "CHATS";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;

    @Column(name = "USER_ID_FIRST")
    protected Long userIDFirst;

    @Column(name = "USER_ID_SECOND")
    protected Long userIDSecond;

}
