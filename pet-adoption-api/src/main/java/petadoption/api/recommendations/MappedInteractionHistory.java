package petadoption.api.recommendations;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Getter
@Setter
@EqualsAndHashCode()
public class MappedInteractionHistory {

    public Long userId;
    public Integer totalLikes;
    public Double avgAge;
    public Double avgWeight;
    public Double avgHeight;

    public Map<String,Integer> breedHistory = new HashMap<>();
    public Map<String,Integer> speciesHistory = new HashMap<>();
    public Map<String,Integer> sexHistory = new HashMap<>();
    public Map<String,Integer> ageClassHistory = new HashMap<>();
    public Map<String,Integer> sizeHistory = new HashMap<>();
    public Map<String,Integer> centerHistory = new HashMap<>();
    public Map<String,Integer> stateHistory = new HashMap<>();
    public Map<String,Integer> cityHistory = new HashMap<>();

    public MappedInteractionHistory(InteractionHistory history){
        this.userId = history.getUserId();
        this.totalLikes = history.getTotalLikes();
        this.avgHeight = history.getAvgHeight();
        this.avgWeight = history.getAvgWeight();
        this.avgAge = history.getAvgAge();

        List<InteractionPoint> points = history.getInteractionPoints();

        this.breedHistory = extractStream(points, InteractionType.BREED);
        this.speciesHistory = extractStream(points, InteractionType.SPECIES);
        this.sexHistory = extractStream(points, InteractionType.SEX);
        this.ageClassHistory = extractStream(points, InteractionType.AGE_CLASS);
        this.sizeHistory = extractStream(points, InteractionType.SIZE);
        this.centerHistory = extractStream(points, InteractionType.CENTER_ID);
        this.stateHistory = extractStream(points, InteractionType.STATE);
        this.cityHistory = extractStream(points, InteractionType.CITY);
    }

    private Map<String,Integer> extractStream(List<InteractionPoint> points,InteractionType type){
        return points.stream()
                .filter(p -> p.getType() == type)
                .collect(
                        Collectors.toMap(InteractionPoint::getName, InteractionPoint::getScore,Integer::sum)
                );
    }


}
