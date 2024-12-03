package petadoption.api.grief;

import java.util.ArrayList;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.ArrayList;

@Data
@Entity
@Getter
@Setter
@EqualsAndHashCode()
public class Grief {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "OWNER_ID")
    private Long potentialOwnerId;

    @Column(name = "NUM_DISLIKES")
    private Integer numDislikes;

    @ElementCollection
    @CollectionTable(name = "euthanized_pets", joinColumns = @JoinColumn(name = "grief_id"))
    @Column(name = "euthanized_pet_ids")
    private List<Long> euthanizedPets = new ArrayList<>();
}
