package petadoption.api.chat;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import petadoption.api.chat.responseObjects.ChatInfoResponse;
import petadoption.api.user.AdoptionCenter;
import petadoption.api.user.PotentialOwner;
import petadoption.api.user.User;
import petadoption.api.user.UserService;
import petadoption.api.user.responseObjects.GenericUserDataResponse;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class ChatService {
    @Autowired
    private ChatRepository chatRepository;
    @Autowired
    private MessageService messageService;
    @Autowired
    private UserService userService;

    public Optional<Chat> getChatByID(Long chatID) {
        return chatRepository.getChatById(chatID);
    }

    public Optional<Chat> getChatByUserIDs(Long userID1, Long userID2) {
        return chatRepository.findByUserIDs(userID1, userID2);
    }

    public void updateChatTimestamp(Message message) {
        // Get the chat
        Optional<Chat> chatOpt = chatRepository.getChatById(message.getChatID());
        if (chatOpt.isEmpty()) {
            return;
        }
        // Update the timestamp
        Chat chat = chatOpt.get();
        chat.setLastUpdated(message.getTimestamp());
        // Save
        chatRepository.save(chat);
    }

    public List<Chat> getChatsByUserID(Long userID) {
        return chatRepository.findChatsByUserID(userID);
    }

    // Constructs a list of ChatInfos by getting the users chats and the most recent messages
    public List<ChatInfoResponse> getChatInfoByUserID(Long userID, Optional<Pageable> pageable) {
        List<ChatInfoResponse> result = new ArrayList<>();
        List<Chat> chats;
        if (pageable.isPresent()) {
            chats = chatRepository.findChatsByUserID(userID, pageable.get());
        } else {
            chats = chatRepository.findChatsByUserID(userID);
        }

        for (Chat chat : chats) {
            Optional<Message> mostRecentMessageOpt = messageService.getMostRecentMessage(chat.getId());
            // Skip any chats with no messages
            if (mostRecentMessageOpt.isEmpty()) {
                continue;
            }
            Message mostRecentMessage = mostRecentMessageOpt.get();

            // Get the other users id, not the one looking at their inbox
            Long otherUserID;
            if (Objects.equals(userID, mostRecentMessage.getRecipientID())) {
                otherUserID = mostRecentMessage.getSenderID();
            } else {
                otherUserID = mostRecentMessage.getRecipientID();
            }
            User user = userService.findUser(otherUserID).orElse(null);
            String otherUserName;
            if(user instanceof PotentialOwner owner){
                otherUserName = owner.getNameFirst() + " " + owner.getNameLast();
            }
            else if(user instanceof AdoptionCenter center){
                otherUserName = center.getName();
            } else {
                otherUserName = null;
            }
            result.add(new ChatInfoResponse(chat, mostRecentMessage, otherUserName, otherUserID));
        }
        return result;
    }

    // Creates and saves a chat. If one already exists, it is returned
    public Chat createChat(Long senderID, Long receiverID) {

        var exists = chatRepository.findByUserIDs(senderID, receiverID);

        if (exists.isPresent()) {
            return exists.get();
        }

        Chat chat = new Chat();
        chat.setUserIDFirst(senderID);
        chat.setUserIDSecond(receiverID);
        return chatRepository.save(chat);
    }

    // USED TO CLEAR TABLE FOR TESTING: See misc/ClearDataController
    @Transactional
    public void clearData() {
        chatRepository.deleteAll();
    }
}
