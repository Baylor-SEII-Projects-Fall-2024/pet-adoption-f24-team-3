package petadoption.api.chat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
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

    public Chat getChatByID(Long chatID) {
        var chat = chatRepository.getChatById(chatID);
        return chat.orElse(null);
    }

    public Optional<Chat> getChatByUserIDs(Long userID1, Long userID2) {
        return chatRepository.findByUserIDs(userID1, userID2);
    }

    public List<Chat> getChatsByUserID(Long userID) {
        return chatRepository.findChatsByUserID(userID);
    }

    // Constructs a list of ChatInfos by getting the users chats and the most recent messages
    public List<ChatInfoResponse> getChatInfoByUserID(Long userID, Optional<Pageable> pageable) {
        List<ChatInfoResponse> result = new ArrayList<>();
        List<Chat> chats = new ArrayList<>();
        if (pageable.isPresent()) {
            chats = chatRepository.findChatsByUserID(userID, pageable.get());
        } else {
            chats = chatRepository.findChatsByUserID(userID);
        }

        for (Chat chat : chats) {
            Message mostRecentMessage = messageService.getMostRecentMessage(chat.getId());
            // Skip any chats with no messages
            if (mostRecentMessage == null) {
                continue;
            }
            result.add(new ChatInfoResponse(chat, mostRecentMessage));
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
