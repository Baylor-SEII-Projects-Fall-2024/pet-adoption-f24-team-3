package petadoption.api.chat;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    public Message saveMessage(Message message, Long chatID) {
        message.setTimestamp(new Date());
        message.setIsRead(false);
        message.setChatID(chatID);
        if (Objects.equals(message.getLink(), "")) {
            message.setLink(null);
        }
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

    public Optional<Message> updateMessageStatus(Long messageID, Boolean status) {
        Optional<Message> foundOpt = messageRepository.getMessageByMessageID(messageID);
        if (foundOpt.isEmpty()) {
            return Optional.empty();
        }

        Message message = foundOpt.get();
        message.setIsRead(status);
        return Optional.of(messageRepository.save(message));
    }

    public Integer getUnreadMessageCount(Long userID) {
        return messageRepository.countMessageByRecipientIDAndIsReadFalse(userID);
    }

    // USED TO CLEAR TABLE FOR TESTING: See misc/ClearDataController
    @Transactional
    public void clearData() {
        messageRepository.deleteAll();
    }
}
