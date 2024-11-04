package petadoption.api.chat;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> getMessagesByChatIDOrderByTimestampDesc(Long chatID);
    List<Message> getMessagesByChatIDOrderByTimestampDesc(Long chatID, Pageable pageable);
    Integer countMessageByRecipientIDAndIsReadFalse(Long userID);
    Optional<Message> findTopByChatIDOrderByTimestampDesc(Long chatID);
    Optional<Message> getMessageByMessageID(Long messageID);
}
