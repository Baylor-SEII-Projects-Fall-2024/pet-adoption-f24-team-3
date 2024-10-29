package petadoption.api.recommendations;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@Log4j2
@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = { "http://localhost:3000", "http://35.184.141.85:3000" })
public class RecommendationsController {
    @Autowired
    RecommendationsService recommendationsService;

    @GetMapping("/users/{userId}")
    public MappedInteractionHistory fetch(@PathVariable Long userId){
        return recommendationsService.findByUser(userId);
    }
}
