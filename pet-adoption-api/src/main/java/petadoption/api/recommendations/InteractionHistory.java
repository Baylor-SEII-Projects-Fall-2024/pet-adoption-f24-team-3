package petadoption.api.recommendations;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Data
@Getter
@Setter
@Entity
@EqualsAndHashCode
public class InteractionHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long historyId;

    @Column(name="USER_ID")
    private Long userId;

    @Column(name="TOTAL_LIKES")
    private int totalLikes = 0  ;

    @OneToMany(mappedBy = "history", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<InteractionPoint> interactionPoints = new ArrayList<>();

    @Column(name="AVG_WEIGHT")
    private Double avgWeight = 0.0;

    @Column(name="AVG_HEIGHT")
    private Double avgHeight= 0.0;

    @Column(name="AVG_AGE")
    private Double avgAge= 0.0;


}
