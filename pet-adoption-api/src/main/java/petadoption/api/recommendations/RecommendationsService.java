package petadoption.api.recommendations;

import jakarta.transaction.Transactional;
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

    //-1 if animal disliked, 1 if animal liked, 0 if neither.
    public int isAnimalLikedOrDisliked(Long userId, Long animalId){
        InteractionHistory ih =  interactionRepository.findByUserId(userId).orElse(null);
        if(ih == null) return 0;
        return getAnimalInteractionStatus(ih,animalId);
    }

    public List<Long> getLikedAnimals(Long userId){
        InteractionHistory ih =  interactionRepository.findByUserId(userId).orElse(null);
        if(ih == null) return null;
        MappedInteractionHistory mh = new MappedInteractionHistory(ih);
        return mh.animalHistory.entrySet().stream()// go through the history of Ids
                .filter(entry->entry.getValue()>0) //filter for liked ones (score is positive)
                .map(Map.Entry::getKey) //get just the keys
                .mapToLong(Long::parseLong) // convert them to longs
                .boxed().toList(); // convert to list
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
            //set if the animal is liked or disliked, or neither
            double likedStatus = getAnimalInteractionStatus(history,a.getId());
            if(likedStatus > 0) a.isLiked = true;
            else if(likedStatus < 0 ) a.isDisliked = true;

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

        if(animal.getSex()!=null)
            score += calculateCompatibility(mappedHistory.getSexHistory(), animal.getSex().toString(), 1.2);
        if(animal.getBreed()!=null)
            score += calculateCompatibility(mappedHistory.getBreedHistory(), animal.getBreed(), 1.5);
        if(animal.getSpecies()!=null)
            score += calculateCompatibility(mappedHistory.getSpeciesHistory(), animal.getSpecies(), 2);
        if(animal.getCenterId()!=null)
            score += calculateCompatibility(mappedHistory.getCenterHistory(), animal.getCenterId().toString(), 0.4);
        if(animal.getState() != null)
            score += calculateCompatibility(mappedHistory.getStateHistory(), animal.getState(), 0.6);
        if(animal.getCity()!= null)
            score += calculateCompatibility(mappedHistory.getCityHistory(), animal.getCity(), 0.6);
        if(animal.getAgeClass()!=null)
            score += getAgeClassCompatibility(animal, mappedHistory.getAgeClassHistory(), 2);
        score += getHeightCompatibility(animal, mappedHistory, 0.6);
        score += getWeightCompatibility(animal, mappedHistory, 0.6);
        score += getAgeCompatibility(animal, mappedHistory, 1.2);
        if(animal.getSize()!=null)
            score += getSizeCompatibility(animal, mappedHistory.getSizeHistory(), 1);
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
        double score =  weight - abs((animal.getAge() - avgAge)/avgAge);
        return Math.clamp(score,0, weight);
    }

    public double getWeightCompatibility(Animal animal, MappedInteractionHistory history, double weight) throws Exception{
        double avgWeight = history.getAvgWeight();
        if(avgWeight == 0) return 0.0;
        double score =  weight - abs((animal.getWeight() - avgWeight)/avgWeight);
        return Math.clamp(score,0, weight);
    }

    public double getHeightCompatibility(Animal animal, MappedInteractionHistory history, double weight) throws Exception{
        double avgHeight = history.getAvgHeight();
        if(avgHeight == 0) return 0.0;
        double score =  weight - abs((animal.getHeight() - avgHeight)/avgHeight);
        return Math.clamp(score,0, weight);
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


        InteractionHistory history = findOrMakeByUser(userId);

        //add record of the animal id - (increment is always  1 or -1)
        modifyAttribute(history, InteractionType.ANIMAL_ID,animalId.toString(), numInteractions/abs(numInteractions));

        // record rest of modifications
        modifyAttribute(history, InteractionType.SPECIES, animal.getSpecies(), numInteractions);
        modifyAttribute(history, InteractionType.BREED, animal.getBreed(), numInteractions);
        if(animal.getSex()!= null)
            modifyAttribute(history, InteractionType.SEX, animal.getSex().toString(), numInteractions);
        if(animal.getAgeClass()!= null)
            modifyAttribute(history, InteractionType.AGE_CLASS, animal.getAgeClass().toString(), numInteractions);
        if(animal.getSize()!= null)
            modifyAttribute(history, InteractionType.SIZE, animal.getSize().toString(), numInteractions);
        modifyAttribute(history, InteractionType.STATE,animal.getState(), numInteractions);
        modifyAttribute(history, InteractionType.CITY, animal.getCity(), numInteractions);
        modifyAttribute(history, InteractionType.CENTER_ID,animal.getCenterId().toString(), numInteractions);



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


    private int getAnimalInteractionStatus(InteractionHistory history, Long animalId) {
        InteractionPoint relevantPoint = history.getInteractionPoints()
                .stream()
                .filter(p -> p.getType() == InteractionType.ANIMAL_ID && p.getName().equals(animalId.toString()))
                .findFirst().orElse(null);

        return relevantPoint == null ? 0 : relevantPoint.getScore();
    }

    // USED TO CLEAR TABLE FOR TESTING: See misc/ClearDataController
    @Transactional
    public void clearData() {
        interactionRepository.deleteAll();
    }

}
