package petadoption.api.chat.responseObjects;

import lombok.Getter;
import petadoption.api.chat.Chat;
import petadoption.api.chat.Message;

import java.util.Date;

@Getter
public class ChatInfoResponse {
    public Long chatID;
    public Long senderID;
    public String mostRecentContent;
    public Boolean hasUnread;
    public Date timestamp;

    // Creates a response assuming the message is the newest message in the chat
    public ChatInfoResponse(Chat chat, Message message) {
        this.chatID = chat.getId();
        this.senderID = message.getSenderID();
        this.mostRecentContent = message.getContent();
        this.hasUnread = message.getIsRead();
        this.timestamp = message.getTimestamp();
    }
}
