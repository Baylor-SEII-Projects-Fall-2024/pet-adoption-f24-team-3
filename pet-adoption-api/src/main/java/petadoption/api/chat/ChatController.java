package petadoption.api.chat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;
import petadoption.api.chat.responseObjects.ChatInfoResponse;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/chats")
@CrossOrigin(origins = { "http://localhost:3000", "http://35.184.141.85:3000" })
public class ChatController {
    @Autowired
    private ChatService chatService;
    @Autowired
    private MessageService messageService;

    // Sends a message mapped to /api/chats/{chatID}
    @MessageMapping("/{chatID}")
    @SendTo("/topic/messages")
    public Message sendMessage(@Payload Message message, @DestinationVariable Long chatID) {
        System.out.println("Received message: " + message);
        return messageService.saveMessage(message, chatID);
    }

    // Gets a chat between two users based on their ids
    @GetMapping("/by-users")
    public ResponseEntity<Chat> getChatByUserIDs(@RequestParam Long userID1, @RequestParam Long userID2) {
        var chat = chatService.getChatByUserIDs(userID1, userID2);
        return chat.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/by-user")
    public List<Chat> getChatsByUserID(@RequestParam Long userID) {
        return chatService.getChatsByUserID(userID);
    }

    // Gets a list of messages by the chatID ordered chronologically
    @GetMapping("/by-chatID")
    public List<Message> getMessagesByChatID(@RequestParam Long chatID) {
        return messageService.getByChatID(chatID);
    }

    // Gets a list of chat infos for a user id, with optional pagination
    @GetMapping("/chat-info-by-user")
    public List<ChatInfoResponse> getChatInfoByUserID(@RequestParam Long userID,
                                                      @RequestParam(required = false) Optional<Integer> pageSize,
                                                      @RequestParam(required = false) Optional<Integer> pageNumber) {
        if (pageSize.isPresent() && pageNumber.isPresent()) {
            Pageable pageable = PageRequest.of(pageNumber.get(), pageSize.get());
            return chatService.getChatInfoByUserID(userID, Optional.of(pageable));
        } else {
            return chatService.getChatInfoByUserID(userID, Optional.empty());
        }
    }

    // Creates a chat between two users. If the chat already exists, it just returns the existing chat
    @PostMapping("/create")
    public Chat createChat(@RequestParam Long senderID, @RequestParam Long receiverID) {
        return chatService.createChat(senderID, receiverID);
    }




}
