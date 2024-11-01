package petadoption.api.chat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ChatService {
    @Autowired
    private ChatRepository chatRepository;

    public Chat getChatByID(Long chatID) {
        var chat = chatRepository.getChatsById(chatID);
        return chat.orElse(null);
    }
}
