package petadoption.api.chat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    public Message saveMessage(Message message, Long chatID) {
        message.setTimestamp(new Date());
        message.setIsRead(false);
        return messageRepository.save(message);
    }

    public List<Message> getByChatID(Long chatID) {
        return messageRepository.getMessagesByChatIDOrderByTimestampDesc(chatID);
    }

    public Message getMostRecentMessage(Long chatID) {
        var message = messageRepository.findTopByChatIDOrderByTimestampDesc(chatID);
        return message.orElse(null);
    }

    public Integer getUnreadMessageCount(Long userID) {
        return messageRepository.countMessageByRecipientIDAndIsReadFalse(userID);
    }

}
