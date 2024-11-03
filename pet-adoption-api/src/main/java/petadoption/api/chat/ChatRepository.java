package petadoption.api.chat;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {
    Optional<Chat> getChatById(Long chatID);

    // Gets the chat by the users IDs, regardless of the order they are in
    @Query("SELECT c FROM Chat c WHERE (c.userIDFirst = :userID1 AND c.userIDSecond = :userID2) " +
            "OR (c.userIDFirst = :userID2 AND c.userIDSecond = :userID1)")
    Optional<Chat> findByUserIDs(Long userID1, Long userID2);

    // Gets a list of chats by a users ID
    @Query("SELECT c FROM Chat c WHERE (c.userIDFirst = :userID) OR (c.userIDSecond = :userID) ORDER BY c.lastUpdated DESC")
    List<Chat> findChatsByUserID(Long userID);

    @Query("SELECT c FROM Chat c WHERE (c.userIDFirst = :userID) OR (c.userIDSecond = :userID) ORDER BY c.lastUpdated DESC")
    List<Chat> findChatsByUserID(Long userID, Pageable pageable);




}
