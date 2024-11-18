package petadoption.api.chat;

import jakarta.transaction.Transactional;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("testdb") // Use H2 in-memory DB for testing
@Transactional
public class MessageTest {

    @Autowired
    private MessageService messageService;

    @Autowired
    private MessageRepository messageRepository;

    @AfterEach
    void tearDown() {
        messageRepository.deleteAll();
    }

    @Test
    void testSaveMessage() {
        // Create a message
        Message message = new Message();
        message.setChatID(1L);
        message.setContent("Hello, this is a test message.");

        // Save the message
        Message savedMessage = messageService.saveMessage(message, 1L);

        // Validate save data
        assertNotNull(savedMessage.getChatID());
        assertNotNull(savedMessage.getTimestamp());
        assertFalse(savedMessage.getIsRead());

        // Make sure it can be found by its ID
        Optional<Message> foundMessageOpt = messageRepository.findById(savedMessage.getMessageID());
        assertTrue(foundMessageOpt.isPresent());
        Message foundMessage = foundMessageOpt.get();

        // Make sure message info remains the same before and after save
        assertEquals(savedMessage.getChatID(), foundMessage.getChatID());
        assertEquals(savedMessage.getContent(), foundMessage.getContent());
        assertEquals(savedMessage.getTimestamp(), foundMessage.getTimestamp());
    }

    @Test
    void testFindLatestMessageByChatID() {
        // Create and save two messages
        Message message1 = new Message();
        message1.setChatID(1L);
        message1.setContent("First message");

        Message message2 = new Message();
        message2.setChatID(1L);
        message2.setContent("Second message");

        messageService.saveMessage(message1, 1L);
        messageService.saveMessage(message2, 1L);

        // Get the most recent message
        Optional<Message> latestMessageOpt = messageService.getMostRecentMessage(1L);

        // Ensure the most recent message was retrieved
        assertTrue(latestMessageOpt.isPresent());
        Message latestMessage = latestMessageOpt.get();
        assertEquals("Second message", latestMessage.getContent());
    }

    @Test
    void testUpdateMessageStatus() {
        // Create and save an unread message
        Message message = new Message();
        message.setChatID(1L);
        message.setContent("Unread message");
        message.setIsRead(false);
        Message savedMessage = messageRepository.save(message);
        Long messageId = savedMessage.getMessageID();

        // Update the status to read
        messageService.updateMessageStatus(messageId, true);

        // Make sure message was updated
        Optional<Message> updatedMessageOpt = messageRepository.findById(messageId);
        assertTrue(updatedMessageOpt.isPresent());
        Message updatedMessage = updatedMessageOpt.get();
        assertTrue(updatedMessage.getIsRead());
    }

    @Test
    void testGetMessagesByChatIDWithoutPagination() {
        // Create two messages for a chat
        Message message1 = new Message();
        message1.setChatID(1L);
        message1.setContent("First message in chat");

        Message message2 = new Message();
        message2.setChatID(1L);
        message2.setContent("Second message in chat");

        messageService.saveMessage(message1, 1L);
        messageService.saveMessage(message2, 1L);

        // Get the messages
        var messages = messageService.getByChatID(1L, Optional.empty());

        // Tests the messages were retrieved in the correct order
        assertEquals(2, messages.size());
        assertEquals("First message in chat", messages.get(1).getContent());
        assertEquals("Second message in chat", messages.get(0).getContent());
    }

    @Test
    void testGetMessagesByChatIDWithPagination() {
        Long chatID = 1L;

        // Create three messages for the chat to test pagination
        Message message1 = new Message();
        message1.setChatID(chatID);
        message1.setContent("First message in chat");
        messageService.saveMessage(message1, chatID);

        Message message2 = new Message();
        message2.setChatID(chatID);
        message2.setContent("Second message in chat");
        messageService.saveMessage(message2, chatID);

        Message message3 = new Message();
        message3.setChatID(chatID);
        message3.setContent("Third message in chat");
        messageService.saveMessage(message3, chatID);

        // Retrieve messages with pagination (limit 2 messages per page)
        Pageable pageable = PageRequest.of(0, 2);
        List<Message> paginatedMessages = messageService.getByChatID(chatID, Optional.of(pageable));

        // Check that the pageable limit is respected and messages are ordered by timestamp descending
        assertEquals(2, paginatedMessages.size());
        assertEquals("Third message in chat", paginatedMessages.get(0).getContent());
        assertEquals("Second message in chat", paginatedMessages.get(1).getContent());
    }

    @Test
    void testGetUnreadMessageCount() {
        Long recipientID = 1L;

        // Create and save messages with different read statuses
        Message message1 = new Message();
        message1.setRecipientID(recipientID);
        message1.setIsRead(false);
        messageRepository.save(message1);

        Message message2 = new Message();
        message2.setRecipientID(recipientID);
        message2.setIsRead(false);
        messageRepository.save(message2);

        Message message3 = new Message();
        message3.setRecipientID(recipientID);
        message3.setIsRead(true);
        messageRepository.save(message3);

        // Check unread message count
        Integer unreadCount = messageService.getUnreadMessageCount(recipientID);
        assertEquals(2, unreadCount, "Unread message count should match the number of unread messages.");
    }
}

