package petadoption.api.chat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ChatService chatService;

    public Message saveMessage(Message message, Long chatID) {
        message.setTimestamp(new Date());
        message.setIsRead(false);
        return messageRepository.save(message);
    }


}
