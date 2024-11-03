package petadoption.api.chat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import petadoption.api.chat.responseObjects.ChatInfoResponse;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ChatService {
    @Autowired
    private ChatRepository chatRepository;
    @Autowired
    private MessageService messageService;

    public Optional<Chat> getChatByID(Long chatID) {
        return chatRepository.getChatById(chatID);
    }

    public Optional<Chat> getChatByUserIDs(Long userID1, Long userID2) {
        return chatRepository.findByUserIDs(userID1, userID2);
    }

    public void updateChatTimestamp(Message message, Long chatID) {
        // Get the chat
        Optional<Chat> chatOpt = chatRepository.getChatById(chatID);
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
            result.add(new ChatInfoResponse(chat, mostRecentMessageOpt.get()));
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
}
