package petadoption.api.chat;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@ToString
public class Message {
    public static final String TABLE_NAME = "MESSAGES";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long messageID;

    @Column(name = "CHAT_ID")
    protected Long chatID;

    @Column(name = "SENDER_ID")
    private Long senderID;

    @Column(name = "RECIPIENT_ID")
    private Long recipientID;

    @Column(name = "CONTENT")
    private String content;

    @Column(name = "LINK")
    private String link = null;

    @Column(name = "TIMESTAMP")
    private Date timestamp;

    @Column(name = "IS_READ")
    private Boolean isRead;
}
