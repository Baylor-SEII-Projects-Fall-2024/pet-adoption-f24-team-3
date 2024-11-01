package petadoption.api.recommendations;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import petadoption.api.animal.Animal;
import petadoption.api.animal.AnimalService;
import petadoption.api.user.AdoptionCenter;
import petadoption.api.user.UserService;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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
    public void dislikeAnimal(Long userId, Long animalId) throws Exception {
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

    public double calculateCompatibilityScore(Animal animal, MappedInteractionHistory mappedHistory) throws Exception {
        double score = 0;
        AdoptionCenter adoptionCenter = userService.findAdoptionCenter(animal.getCenterId()).orElse(null);
        if (adoptionCenter == null) {
            throw new Exception("AdoptionCenter not found!");
        }
        score += calculateCompatibility(mappedHistory.getSexHistory(), animal.getSex().toString(), 1);
        score += calculateCompatibility(mappedHistory.getBreedHistory(), animal.getBreed(), 1);
        score += calculateCompatibility(mappedHistory.getSpeciesHistory(), animal.getSpecies(), 1);
        score += calculateCompatibility(mappedHistory.getCenterHistory(), animal.getCenterId().toString(), 0.4);
        score += calculateCompatibility(mappedHistory.getStateHistory(), adoptionCenter.getState(), 0.6);
        score += calculateCompatibility(mappedHistory.getCityHistory(), adoptionCenter.getCity(), 0.6);
        score += getAgeClassCompatibility(animal, mappedHistory.getAgeClassHistory());
        score += getHeightCompatibility(animal, mappedHistory);
        score += getWeightCompatibility(animal, mappedHistory);
        score += getAgeCompatibility(animal, mappedHistory);
        score += getSizeCompatibility(animal, mappedHistory.getSizeHistory());
        return score;
    }

    public double calculateCompatibility(Map<String, Integer> historyMap, String targetAttribute, double maxValue) {
        int maxVal = (Collections.max(historyMap.values()));

        int specifiedScore = historyMap.getOrDefault(targetAttribute, 0);

        return maxValue * ((double) specifiedScore / maxVal);
    }

    public double getSexCompatibility(Long userId, Long animalId) throws Exception {
        InteractionHistory history = findOrMakeByUser(userId);
        Animal animal = animalService.findAnimal(animalId).orElse(null);
        if (animal == null) {
            throw new Exception("Animal not found!");
        }

        MappedInteractionHistory mapHistory = new MappedInteractionHistory(history);
        Map<String, Integer> sexHistory = mapHistory.getSexHistory();

        return calculateCompatibility(sexHistory, animal.getSex().toString(), 1.0);
    }

    public double getSpeciesCompatibility(Long userId, Long animalId) throws Exception {
        InteractionHistory history = findOrMakeByUser(userId);
        Animal animal = animalService.findAnimal(animalId).orElse(null);
        if (animal == null) {
            throw new Exception("Animal not found!");
        }

        MappedInteractionHistory mapHistory = new MappedInteractionHistory(history);
        Map<String, Integer> speciesHistory = mapHistory.getSpeciesHistory();

        return calculateCompatibility(speciesHistory, animal.getSpecies(), 1.0);
    }

    public double getBreedCompatibility(Long userId, Long animalId) throws Exception {
        InteractionHistory history = findOrMakeByUser(userId);
        Animal animal = animalService.findAnimal(animalId).orElse(null);
        if (animal == null) {
            throw new Exception("Animal not found!");
        }

        MappedInteractionHistory mapHistory = new MappedInteractionHistory(history);
        Map<String, Integer> breedHistory = mapHistory.getBreedHistory();

        return calculateCompatibility(breedHistory, animal.getBreed(), 1.0);
    }

    public double getAgeClassCompatibility(Animal animal, Map<String, Integer> history) throws Exception {
        int maxVal = (Collections.max(history.values()));

        int specifiedScore = history.getOrDefault(animal.getAgeClass().toString(), 0);

        return 1 - (double) abs(maxVal - specifiedScore) /maxVal;
    }

    public double getAgeCompatibility(Animal animal, MappedInteractionHistory history) throws Exception{
        double avgAge = history.getAvgAge();

        return (animal.getAge() - avgAge)/avgAge;
    }

    public double getWeightCompatibility(Animal animal, MappedInteractionHistory history) throws Exception{
        double avgWeight = history.getAvgWeight();

        return (animal.getWeight() - avgWeight)/avgWeight;
    }

    public double getHeightCompatibility(Animal animal, MappedInteractionHistory history) throws Exception{
        double avgHeight = history.getAvgHeight();

        return (animal.getHeight() - avgHeight)/avgHeight;
    }

    public double getSizeCompatibility(Animal animal, Map<String, Integer> history) throws Exception {
        int maxVal = (Collections.max(history.values()));

        int specifiedScore = history.getOrDefault(animal.getSize().toString(), 0);

        return 1 - (double) abs(maxVal - specifiedScore) /maxVal;
    }

    public double getCenterCompatibility(Long userId, Long animalId) throws Exception {
        InteractionHistory history = findOrMakeByUser(userId);
        Animal animal = animalService.findAnimal(animalId).orElse(null);
        if (animal == null) {
            throw new Exception("Animal not found!");
        }

        MappedInteractionHistory mapHistory = new MappedInteractionHistory(history);
        Map<String, Integer> centerHistory = mapHistory.getCenterHistory();

        return calculateCompatibility(centerHistory, animal.getCenterId().toString(), 0.4);
    }

    public double getStateCompatibility(Long userId, Long animalId) throws Exception {
        InteractionHistory history = findOrMakeByUser(userId);
        Animal animal = animalService.findAnimal(animalId).orElse(null);
        if (animal == null) {
            throw new Exception("Animal not found!");
        }

        AdoptionCenter adoptionCenter = userService.findAdoptionCenter(animal.getCenterId()).orElse(null);
        if (adoptionCenter == null) {
            throw new Exception("AdoptionCenter not found!");
        }

        MappedInteractionHistory mapHistory = new MappedInteractionHistory(history);
        Map<String, Integer> stateHistory = mapHistory.getStateHistory();

        return calculateCompatibility(stateHistory, adoptionCenter.getState(), 0.6);
    }

    public double getCityCompatibility(Long userId, Long animalId) throws Exception {
        InteractionHistory history = findOrMakeByUser(userId);
        Animal animal = animalService.findAnimal(animalId).orElse(null);
        if (animal == null) {
            throw new Exception("Animal not found!");
        }

        AdoptionCenter adoptionCenter = userService.findAdoptionCenter(animal.getCenterId()).orElse(null);
        if (adoptionCenter == null) {
            throw new Exception("AdoptionCenter not found!");
        }

        MappedInteractionHistory mapHistory = new MappedInteractionHistory(history);
        Map<String, Integer> cityHistory = mapHistory.getCityHistory();

        return calculateCompatibility(cityHistory, adoptionCenter.getCity(), 0.6);
    }


}
