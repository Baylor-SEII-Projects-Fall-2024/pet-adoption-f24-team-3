package petadoption.api.misc;

import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Log4j2
@RestController
@CrossOrigin(origins = {"http://localhost:3000","http://34.69.88.79:3000"})
public class TestController {

    @GetMapping("/test")
    public String returnTestPoint(@RequestParam("username") String username) {
        return "I think your username, '" + username + "', is really cool!";
    }

    @GetMapping("/ping")
    public String ping() {
        return "pong!";
    }

    @GetMapping("/memory-ping")
    public String memoryPing() {
        return String.format("Max available memory: %.3f MB", (Runtime.getRuntime().maxMemory() / (1024.0 * 1024.0)));
    }
}
