package petadoption.api.recommendations;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import petadoption.api.animal.Animal;
import petadoption.api.animal.AnimalService;
import petadoption.api.user.AdoptionCenter;
import petadoption.api.user.UserService;

import java.util.*;
import java.util.stream.Collectors;

import static java.lang.Math.abs;
import static java.lang.Math.max;


@Service
@Log4j2
public class RecommendationsService {
    @Autowired
    AnimalService animalService;
    @Autowired
    UserService userService;

    @Autowired
    InteractionRepository interactionRepository;

    public InteractionHistory findByUser(Long userId){
        return interactionRepository.findByUserId(userId).orElse(null);
    }
    public MappedInteractionHistory findByUserMapped(Long userId){
        InteractionHistory ih =  interactionRepository.findByUserId(userId).orElse(null);
        return ih == null? null : new MappedInteractionHistory(ih);
    }

    public void createHistory(Long userId){
        InteractionHistory history = findOrMakeByUser(userId);
        interactionRepository.save(history);
    }
    public void likeAnimal(Long userId, Long animalId) throws Exception {
        addInteractions(userId,animalId,1);
    }
    public void dislikeAnimal(Long userId, Long animalId) throws Exception {
        addInteractions(userId,animalId,-1);
    }

    public boolean resetHistory(Long userId){
        InteractionHistory history = interactionRepository.findByUserId(userId).orElse(null);
        if(history != null){
            interactionRepository.delete(history);
            return true;
        }
        return false;
    }

    public List<Animal> orderByCompatibilityScore(List<Animal> animals, Long userId) throws Exception {
        if(userId == null || userId<1)
            throw new Exception("Invlid User ID!");

        //get the interaction history
        InteractionHistory history = findOrMakeByUser(userId);
        MappedInteractionHistory mappedHistory= new MappedInteractionHistory(history);

        //calculate the compatibility scores of each animal
        Map<Long,Double> animalRatings = new HashMap<>();
        for(Animal a : animals){
            double score = calculateCompatibilityScore(a,mappedHistory);
            a.setScore(score);
            animalRatings.put(a.getId(),score);
        }

        //return the list reordered by compatibility score
        List<Animal> sortedAnimals =  animals.stream()
                    .sorted(
                            Comparator.comparing(a -> animalRatings.get(a.getId()))
                    )
                .collect(Collectors.toList());
        Collections.reverse(sortedAnimals);
        return sortedAnimals;
    }

    public double calculateForSingleAnimal(Long animalId, Long userId) throws Exception {
        InteractionHistory history = interactionRepository.findByUserId(userId).orElse(null);
        if(history == null) return -1;

        MappedInteractionHistory mappedInteractionHistory = new MappedInteractionHistory(history);

        Animal animal = animalService.findAnimal(animalId).orElse(null);
        if(animal == null) return -1;

        return calculateCompatibilityScore(animal,mappedInteractionHistory);

    }

    public double calculateCompatibilityScore(Animal animal, MappedInteractionHistory mappedHistory) throws Exception {

        double score = 0;
        Random randomNum = new Random();
        //AdoptionCenter adoptionCenter = userService.findAdoptionCenter(animal.getCenterId()).orElse(null);
        //if (adoptionCenter == null) {
        //    throw new Exception("AdoptionCenter not found!");
        //}
        if(animal.getSex()!=null)
            score += calculateCompatibility(mappedHistory.getSexHistory(), animal.getSex().toString(), 1.2);
        //log.info("Sex:"+score);
        if(animal.getBreed()!=null)
            score += calculateCompatibility(mappedHistory.getBreedHistory(), animal.getBreed(), 1.5);
        //log.info("Breed:"+score);
        if(animal.getSpecies()!=null)
            score += calculateCompatibility(mappedHistory.getSpeciesHistory(), animal.getSpecies(), 2);
        //log.info("Species:"+score);
        if(animal.getCenterId()!=null)
            score += calculateCompatibility(mappedHistory.getCenterHistory(), animal.getCenterId().toString(), 0.4);
        //log.info("Center:"+score);
        //score += calculateCompatibility(mappedHistory.getStateHistory(), adoptionCenter.getState(), 0.6);
        //score += calculateCompatibility(mappedHistory.getCityHistory(), adoptionCenter.getCity(), 0.6);
        if(animal.getAgeClass()!=null)
            score += getAgeClassCompatibility(animal, mappedHistory.getAgeClassHistory(), 2);
        //log.info("Age Class:"+score);
        score += getHeightCompatibility(animal, mappedHistory, 0.6);
        //log.info("Height:"+score);
        score += getWeightCompatibility(animal, mappedHistory, 0.6);
        //log.info("Weight:"+score);
        score += getAgeCompatibility(animal, mappedHistory, 1.2);
        //log.info("Age:"+score);
        if(animal.getSize()!=null)
            score += getSizeCompatibility(animal, mappedHistory.getSizeHistory(), 1);
        //log.info("Size:"+score);
        score += randomNum.nextDouble(2.0);
        //log.info("Random:"+score);
        return score;
    }

    public double calculateCompatibility(Map<String, Integer> historyMap, String targetAttribute, double weight) {
        if(historyMap.isEmpty()) return 0.0;

        int maxVal = (Collections.max(historyMap.values()));

        if(maxVal == 0) return 0.0;

        int specifiedScore = historyMap.getOrDefault(targetAttribute, 0);
        return weight * ((double) specifiedScore / maxVal);
    }

    public double getAgeClassCompatibility(Animal animal, Map<String, Integer> history, double weight) throws Exception {
        if(history.isEmpty()) return 0;
        int maxVal = (Collections.max(history.values()));
        if(maxVal == 0) return 0.0;
        int specifiedScore = history.getOrDefault(animal.getAgeClass().toString(), 0);

        return (1 - (double) abs(maxVal - specifiedScore) /maxVal) * weight;
    }

    public double getAgeCompatibility(Animal animal, MappedInteractionHistory history, double weight) throws Exception{
        double avgAge = history.getAvgAge();
        if(avgAge == 0) return 0.0;
        double score =  weight - ((animal.getAge() - avgAge)/avgAge);
        return Math.clamp(score,-weight, weight);
    }

    public double getWeightCompatibility(Animal animal, MappedInteractionHistory history, double weight) throws Exception{
        double avgWeight = history.getAvgWeight();
        if(avgWeight == 0) return 0.0;
        double score =  weight - ((animal.getWeight() - avgWeight)/avgWeight);
        return Math.clamp(score,-weight, weight);
    }

    public double getHeightCompatibility(Animal animal, MappedInteractionHistory history, double weight) throws Exception{
        double avgHeight = history.getAvgHeight();
        if(avgHeight == 0) return 0.0;
        double score =  weight - ((animal.getHeight() - avgHeight)/avgHeight);
        return Math.clamp(score,-weight, weight);
    }

    public double getSizeCompatibility(Animal animal, Map<String, Integer> history, double weight) throws Exception {
        if(history.isEmpty()) return 0;

        int maxVal = (Collections.max(history.values()));
        int specifiedScore = history.getOrDefault(animal.getSize().toString(), 0);

        return (1 - (double) abs(maxVal - specifiedScore) /maxVal) * weight;
    }


    private  InteractionHistory findOrMakeByUser(Long userId){
        InteractionHistory history =  interactionRepository.findByUserId(userId).orElse(null);
        if(history == null){
            history = new InteractionHistory();
            history.setUserId(userId);
        }
        return history;
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

    private void modifyAttribute(InteractionHistory history, InteractionType type, String name, Integer increment){
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
    }

    private double modifyAverage(double average, int oldTotal, double newValue, int itemsAdded){
        double oldSum = average * oldTotal;
        double newSum = oldSum + (newValue * itemsAdded);
        double newTotal = oldTotal + itemsAdded;
        return newSum / newTotal;
    }


}
