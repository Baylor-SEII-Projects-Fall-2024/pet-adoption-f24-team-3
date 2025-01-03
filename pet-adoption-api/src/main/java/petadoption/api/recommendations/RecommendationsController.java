package petadoption.api.recommendations;

import petadoption.api.annotation.GlobalCrossOrigin;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@Log4j2
@RestController
@RequestMapping("/api/recommendations")
@GlobalCrossOrigin
public class RecommendationsController {
    @Autowired
    RecommendationsService recommendationsService;

    @GetMapping("/{userId}")
    public MappedInteractionHistory fetch(@PathVariable Long userId){
        return recommendationsService.findByUserMapped(userId);
    }

    @GetMapping("/{userId}/calculate/{animalId}")
    public double getScoreForAnimal(@PathVariable Long userId, @PathVariable Long animalId) throws Exception {
        return recommendationsService.calculateForSingleAnimal(animalId,userId);
    }

    @DeleteMapping("/{userId}")
    public boolean resetHistory(@PathVariable Long userId){
        return recommendationsService.resetHistory(userId);
    }

    @PutMapping("/{userId}/like/{animalId}")
    public HttpStatus likeAnimal(@PathVariable Long userId, @PathVariable Long animalId) throws Exception {
        try {
            recommendationsService.likeAnimal(userId, animalId);
            return HttpStatus.OK;
        } catch (Exception e){
            log.error(e.getMessage());
            e.printStackTrace();
            return HttpStatus.BAD_REQUEST;
        }
    }
    @PutMapping("/{userId}/like/{animalId}/undo")
    public HttpStatus undoLikeAnimal(@PathVariable Long userId, @PathVariable Long animalId) throws Exception {
        try {
            recommendationsService.dislikeAnimal(userId, animalId);
            return HttpStatus.OK;
        } catch (Exception e){
            log.error(e.getMessage());
            e.printStackTrace();
            return HttpStatus.BAD_REQUEST;
        }
    }
    @PutMapping("/{userId}/dislike/{animalId}")
    public HttpStatus dislikeAnimal(@PathVariable Long userId, @PathVariable Long animalId) throws Exception {
        try {
            recommendationsService.dislikeAnimal(userId, animalId);
            return HttpStatus.OK;
        } catch (Exception e){
            log.error(e.getMessage());
            e.printStackTrace();
            return HttpStatus.BAD_REQUEST;
        }
    }

    @PutMapping("/{userId}/dislike/{animalId}/undo")
    public HttpStatus undoDislikeAnimal(@PathVariable Long userId, @PathVariable Long animalId) throws Exception {
        try {
            recommendationsService.likeAnimal(userId, animalId);
            return HttpStatus.OK;
        } catch (Exception e){
            log.error(e.getMessage());
            e.printStackTrace();
            return HttpStatus.BAD_REQUEST;
        }
    }
}
