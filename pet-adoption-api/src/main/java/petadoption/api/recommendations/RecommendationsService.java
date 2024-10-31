package petadoption.api.recommendations;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import petadoption.api.animal.Animal;
import petadoption.api.animal.AnimalService;
import petadoption.api.user.AdoptionCenter;
import petadoption.api.user.UserService;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import static java.lang.Math.abs;

@Service
public class RecommendationsService {
    @Autowired
    AnimalService animalService;
    @Autowired
    UserService userService;

    @Autowired
    InteractionRepository interactionRepository;

    public MappedInteractionHistory findByUser(Long userId){
        InteractionHistory ih =  interactionRepository.findByUserId(userId).orElse(null);
        return ih == null? null : new MappedInteractionHistory(ih);
    }

    public void likeAnimal(Long userId, Long animalId) throws Exception {
        addInteractions(userId,animalId,1);
    }
    public void disLikeAnimal(Long userId, Long animalId) throws Exception {
        addInteractions(userId,animalId,-1);
    }

    private  InteractionHistory findOrMakeByUser(Long userId){
        InteractionHistory history =  interactionRepository.findByUserId(userId).orElse(null);
        if(history == null){
            history = new InteractionHistory();
            history.setUserId(userId);
        }
        return history;
    }


    private InteractionHistory disLikeAttribute(InteractionHistory history, InteractionType attribute, String name){
        return modifyAttribute(history, attribute, name, -1);
    }

    //Num interactions: positive for good interactions, negative for bad
    // i.e. 1 like for an animal = 1, 2 dislikes = -2
    private void addInteractions(Long userId, Long animalId, int numInteractions) throws Exception {
        Animal animal = animalService.findAnimal(animalId).orElse(null);
        if(animal == null){
            throw new Exception("Animal not found!");
        }

        AdoptionCenter center = userService.findAdoptionCenter(animal.getCenterId()).orElse(null);
        if(center == null){
            throw new Exception("Center not found!");
        }

        InteractionHistory history = findOrMakeByUser(userId);
        modifyAttribute(history, InteractionType.SPECIES, animal.getSpecies(), numInteractions);
        modifyAttribute(history, InteractionType.BREED, animal.getBreed(), numInteractions);
        if(animal.getSex()!= null)
            modifyAttribute(history, InteractionType.SEX, animal.getSex().toString(), numInteractions);
        if(animal.getAgeClass()!= null)
            modifyAttribute(history, InteractionType.AGE_CLASS, animal.getAgeClass().toString(), numInteractions);
        if(animal.getSize()!= null)
         modifyAttribute(history, InteractionType.SIZE, animal.getSize().toString(), numInteractions);
        modifyAttribute(history, InteractionType.STATE,center.getState(), numInteractions);
        modifyAttribute(history, InteractionType.CITY, center.getCity(), numInteractions);
        modifyAttribute(history, InteractionType.CENTER_ID,center.getId().toString(), numInteractions);

        if(numInteractions >0){
            history.setAvgAge(modifyAverage(history.getAvgAge(), history.getTotalLikes(), animal.getAge(),numInteractions));
            history.setAvgHeight(modifyAverage(history.getAvgHeight(), history.getTotalLikes(), animal.getHeight(),numInteractions));
            history.setAvgWeight(modifyAverage(history.getAvgWeight(), history.getTotalLikes(), animal.getWeight(),numInteractions));
            history.setTotalLikes(history.getTotalLikes()+numInteractions);
        }


        interactionRepository.save(history);
    }

    private InteractionHistory modifyAttribute(InteractionHistory history,InteractionType type,String name,Integer increment){
        List<InteractionPoint> points = history.getInteractionPoints();

        Optional<InteractionPoint> existingPoint = points.stream()
                .filter(p-> p.getType() == type && p.getName().equals(name))
                .findFirst();

        if (existingPoint.isPresent()) {
            InteractionPoint modifiedPoint = existingPoint.get();
            modifiedPoint.setScore(modifiedPoint.getScore() + increment);
            points.set(points.indexOf(existingPoint.get()), modifiedPoint);
        } else {
            points.add(new InteractionPoint(type,name,history,increment));
        }
        history.setInteractionPoints(points);
        return history;
    }

    private double modifyAverage(double average, int oldTotal, double newValue, int itemsAdded){
        double oldSum = average * oldTotal;
        double newSum = oldSum + (newValue * itemsAdded);
        double newTotal = oldTotal + itemsAdded;
        return newSum / newTotal;
    }

    private int getAttribute(InteractionHistory history, InteractionType type, String name){
        List<InteractionPoint> points = history.getInteractionPoints();
        Optional<InteractionPoint> existingPoint = points.stream()
                .filter(p-> p.getType() == type && p.getName().equals(name))
                .findFirst();
        return existingPoint.isPresent() ? existingPoint.get().getScore() : 0;
    }

    public double getSexCompatibility(Long userId, Long animalId) throws Exception {
        InteractionHistory history = findOrMakeByUser(userId);
        Animal animal = animalService.findAnimal(animalId).orElse(null);
        if(animal == null){
            throw new Exception("Animal not found!");
        }

        int currentScore = getAttribute(history, InteractionType.SEX, animal.getName()); //problem is here
        MappedInteractionHistory mapHistory = new MappedInteractionHistory(history);
        Map<String, Integer> sexHistory = mapHistory.getSexHistory();

        String nameFav = sexHistory.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey).orElse("No Value Found");

        int numFav = sexHistory.get(nameFav);

        int specifiedScore = sexHistory.getOrDefault(animal.getSex().toString(), 0);

        return (double) specifiedScore /numFav;
    }

}
