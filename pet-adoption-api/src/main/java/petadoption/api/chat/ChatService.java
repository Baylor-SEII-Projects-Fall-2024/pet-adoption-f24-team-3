package petadoption.api.chat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ChatService {
    @Autowired
    private ChatRepository chatRepository;

    public Chat getChatByID(Long chatID) {
        var chat = chatRepository.getChatsById(chatID);
        return chat.orElse(null);
    }

    public Optional<Chat> getChatByUserIDs(Long userID1, Long userID2) {
        return chatRepository.findByUserIDs(userID1, userID2);
    }

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
