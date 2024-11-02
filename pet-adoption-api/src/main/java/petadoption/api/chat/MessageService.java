package petadoption.api.chat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    public Message saveMessage(Message message, Long chatID) {
        message.setTimestamp(new Date());
        message.setIsRead(false);
        message.setChatID(chatID);
        return messageRepository.save(message);
    }

    public List<Message> getByChatID(Long chatID, Optional<Pageable> pageable) {
        if (pageable.isPresent()) {
            return messageRepository.getMessagesByChatIDOrderByTimestampDesc(chatID, pageable.get());
        } else {
            return messageRepository.getMessagesByChatIDOrderByTimestampDesc(chatID);
        }
    }

    public Optional<Message> getMostRecentMessage(Long chatID) {
        return messageRepository.findTopByChatIDOrderByTimestampDesc(chatID);
    }

    public void updateMessageStatus(Long messageID, Boolean status) {
        Optional<Message> foundOpt = messageRepository.getMessageByMessageID(messageID);
        if (foundOpt.isEmpty()) {
            return;
        }

        Message message = foundOpt.get();
        message.setIsRead(status);
        messageRepository.save(message);
    }

    public Integer getUnreadMessageCount(Long userID) {
        return messageRepository.countMessageByRecipientIDAndIsReadFalse(userID);
    }

}
