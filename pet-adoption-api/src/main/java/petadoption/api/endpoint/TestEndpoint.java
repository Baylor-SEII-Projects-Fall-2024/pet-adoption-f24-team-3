package petadoption.api.endpoint;

import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Log4j2
@RestController
public class TestEndpoint {
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/test")
    public String returnTestPoint() {
        return "Wow, what a cool test!";
    }
}
