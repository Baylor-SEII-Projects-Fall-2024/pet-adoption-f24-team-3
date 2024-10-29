package petadoption.api.recommendations;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RecommendationsService {
    @Autowired
    InteractionRepository interactionRepository;

    public MappedInteractionHistory findByUser(Long userId){
        InteractionHistory ih =  interactionRepository.findByUserId(userId).orElse(null);
        return ih == null? null : new MappedInteractionHistory(ih);
    }
}
