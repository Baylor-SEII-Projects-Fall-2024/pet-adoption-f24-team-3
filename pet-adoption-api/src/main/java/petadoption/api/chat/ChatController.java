package petadoption.api.chat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.Date;

@Controller
public class ChatController {
    @Autowired
    private ChatService chatService;
    @Autowired
    private MessageService messageService;

    @MessageMapping("/chat/{chatID}")
    @SendTo("/topic/messages")
    public Message sendMessage(@Payload Message message, @DestinationVariable Long chatID) {
        System.out.println("Received message: " + message);
        return messageService.saveMessage(message, chatID);
    }

}
