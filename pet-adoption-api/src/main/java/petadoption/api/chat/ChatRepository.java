package petadoption.api.chat;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {
    Optional<Chat> getChatsById(Long chatID);

    // Gets the chat by the users ids, regardless of the order they are in
    @Query("SELECT c FROM Chat c WHERE (c.userIDFirst = :userID1 AND c.userIDSecond = :userID2) " +
            "OR (c.userIDFirst = :userID2 AND c.userIDSecond = :userID1)")
    Optional<Chat> findByUserIDs(Long userID1, Long userID2);
}
