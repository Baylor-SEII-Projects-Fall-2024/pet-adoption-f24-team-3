package petadoption.api.chat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
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
    protected Long chatID;

    @Column(name = "SENDER_ID")
    private Long senderID;

    @Column(name = "RECIPIENT_ID")
    private Long recipientID;

    @Column(name = "CONTENT")
    private String content;

    @Column(name = "TIMESTAMP")
    private Date timestamp;

    @Column(name = "IS_READ")
    private Boolean isRead;
}
