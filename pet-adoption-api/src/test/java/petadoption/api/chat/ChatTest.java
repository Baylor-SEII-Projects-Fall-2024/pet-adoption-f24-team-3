package petadoption.api.chat;

import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.ActiveProfiles;
import petadoption.api.chat.responseObjects.ChatInfoResponse;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("testdb")
@Transactional
public class ChatTest {

    @Autowired
    ChatService chatService;

    @Autowired
    MessageService messageService;

    @Test
    @BeforeEach
    // Save a chat and ensure the userIDs remain the same
    public void testCreateChat() {

        Long userIDFirst = 1L;
        Long userIDSecond = 2L;

        Chat savedChat = chatService.createChat(userIDFirst, userIDSecond);
        assertNotNull(savedChat);

        Optional<Chat> foundChatOpt = chatService.getChatByID(savedChat.getId());
        assertTrue(foundChatOpt.isPresent());
        Chat foundChat = foundChatOpt.get();

        assertEquals(savedChat.getUserIDFirst(), foundChat.getUserIDFirst());
        assertEquals(savedChat.getUserIDSecond(), foundChat.getUserIDSecond());

        Long userIDThird = 3L;
        chatService.createChat(userIDFirst, userIDThird);
    }

    @Test
    void testChatFindNotExists() {
        Optional<Chat> chat = chatService.getChatByID(-1L);
        assertTrue(chat.isEmpty());
        Optional<Chat> chat2 = chatService.getChatByID(5000L);
        assertTrue(chat2.isEmpty());
    }

    @Test
    void testChatFindByUsers() {
        // Get the chat using both combinations of ids
        Optional<Chat> chat1 = chatService.getChatByUserIDs(1L, 2L);
        assertTrue(chat1.isPresent());
        Optional<Chat> chat2 = chatService.getChatByUserIDs(2L, 1L);
        assertTrue(chat2.isPresent());

        // Ensure the two are the same
        assertEquals(chat1.get(), chat2.get());
    }

    @Test
    void testChatFindByUsersNotExist() {
        // Test for two non-existing users
        Optional<Chat> chat1 = chatService.getChatByUserIDs(0L, 5L);
        assertTrue(chat1.isEmpty());
        // Check for just one correct participant
        Optional<Chat> chat2 = chatService.getChatByUserIDs(1L, 0L);
        assertTrue(chat2.isEmpty());
        Optional<Chat> chat3 = chatService.getChatByUserIDs(8L, 1L);
        assertTrue(chat3.isEmpty());
    }

    @Test
    void testChatFindByUser() {
        // Find user with existing chats
        List<Chat> user1Chats = chatService.getChatsByUserID(1L);
        assertEquals(2, user1Chats.size());

        // Find user with no existing chats
        List<Chat> notExists = chatService.getChatsByUserID(-1L);
        assertEquals(notExists.size(), 0);
    }

    @Test
    void testGetChatInfoByUserIDWithMessages() {
        Long userID = 1L;

        // Set up sample chats and messages
        Chat chat1 = chatService.createChat(userID, 2L);
        Chat chat2 = chatService.createChat(userID, 3L);

        Message message1 = new Message();
        message1.setSenderID(userID);
        message1.setContent("Hello in chat1");
        messageService.saveMessage(message1, chat1.getId());

        Message message2 = new Message();
        message2.setSenderID(userID);
        message2.setContent("Hello in chat2");
        messageService.saveMessage(message2, chat2.getId());

        // Get chat info without pagination
        List<ChatInfoResponse> chatInfo = chatService.getChatInfoByUserID(userID, Optional.empty());
        assertEquals(2, chatInfo.size(), "Chat info should contain two chat entries.");

        // Verify that each chat has the most recent message
        for (ChatInfoResponse info : chatInfo) {
            assertNotNull(info.getMostRecentContent());
            assertTrue(info.getMostRecentContent().contains("Hello"),
                    "Most recent message content should match expected.");
        }
    }

    @Test
    void testGetChatInfoByUserIDWithPagination() {
        Long userID = 1L;
        Pageable pageable = PageRequest.of(0, 1);

        // Set up sample chats and messages
        Chat chat1 = chatService.createChat(userID, 2L);
        Chat chat2 = chatService.createChat(userID, 3L);

        Message message1 = new Message();
        message1.setChatID(chat1.getId());
        message1.setSenderID(userID);
        message1.setContent("Hello in chat1");
        messageService.saveMessage(message1, chat1.getId());

        Message message2 = new Message();
        message2.setChatID(chat2.getId());
        message2.setSenderID(userID);
        message2.setContent("Hello in chat2");
        messageService.saveMessage(message2, chat2.getId());

        // Get chat info with pagination (should return only 1 chat entry)
        List<ChatInfoResponse> chatInfo = chatService.getChatInfoByUserID(userID, Optional.of(pageable));
        assertEquals(1, chatInfo.size(), "Paginated chat info should contain only one chat entry.");
    }

    @Test
    void testGetChatInfoByUserIDWithNoMessages() {
        Long userID = 1L;

        // Set up a chat with no messages
        Chat chat = chatService.createChat(userID, 4L);

        // Get chat info without pagination
        List<ChatInfoResponse> chatInfo = chatService.getChatInfoByUserID(userID, Optional.empty());
        assertTrue(chatInfo.isEmpty(), "Chat info should be empty when there are no messages.");
    }


}
