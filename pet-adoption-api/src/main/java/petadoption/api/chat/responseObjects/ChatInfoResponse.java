package petadoption.api.chat.responseObjects;

import lombok.Getter;
import petadoption.api.chat.Chat;
import petadoption.api.chat.Message;

import java.util.Date;
import java.util.Objects;

@Getter
public class ChatInfoResponse {
    public Long chatID;
    public Long otherUserID;
    public String otherUserName;
    public String mostRecentContent;
    public Boolean hasUnread;
    public Date timestamp;

    // Creates a response assuming the message is the newest message in the chat
    public ChatInfoResponse(Chat chat, Message message, String otherUserName, Long otherUserID) {
        this.chatID = chat.getId();
        this.otherUserID = otherUserID;
        this.otherUserName = otherUserName;
        this.mostRecentContent = message.getContent();
        this.timestamp = message.getTimestamp();
        this.hasUnread = Objects.equals(message.getSenderID(), otherUserID) && !(message.getIsRead());
    }
}
