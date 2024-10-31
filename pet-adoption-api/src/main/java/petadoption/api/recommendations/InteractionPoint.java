package petadoption.api.recommendations;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class InteractionPoint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JsonBackReference
    InteractionHistory history;

    private InteractionType type;
    private String name;
    private Integer score;

    public InteractionPoint() {}
    public InteractionPoint(InteractionType type, String name, InteractionHistory history,Integer initialValue){
        this();
        this.type = type;
        this.name = name;
        this.score = initialValue;
        this.history = history;
    }


}

