package petadoption.api.grief;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Log4j2
@Service
public class GriefService {

    @Autowired
    private GriefRepository griefRepository;

    // Get the number of dislikes for a specific user (potentialOwnerId)
    public Integer getDislikeCount(Long potentialOwnerId) {
        Optional<Grief> grief = griefRepository.findByPotentialOwnerId(potentialOwnerId);
        if (grief.isPresent()) {
            return grief.get().getNumDislikes();
        } else {
            return 0;  // If the user doesn't have a Grief record, return 0
        }
    }

    // Increment the dislike count for the specific user
    public void incrementDislikeCount(Long potentialOwnerId) {
        Optional<Grief> grief = griefRepository.findByPotentialOwnerId(potentialOwnerId);
        if (grief.isPresent()) {
            grief.get().setNumDislikes(grief.get().getNumDislikes() + 1);
            griefRepository.save(grief.get());
        } else {
            // If there's no Grief entry for the user, create a new one
            Grief newGrief = new Grief();
            newGrief.setPotentialOwnerId(potentialOwnerId);
            newGrief.setNumDislikes(1);
            griefRepository.save(newGrief);
        }
    }

    // Decrement the dislike count for the specific user
    public void decrementDislikeCount(Long potentialOwnerId) {
        Optional<Grief> grief = griefRepository.findByPotentialOwnerId(potentialOwnerId);
        if (grief.isPresent()) {
            int numDislikes = grief.get().getNumDislikes();
            if (numDislikes > 0) {
                grief.get().setNumDislikes(numDislikes - 1);
                griefRepository.save(grief.get());
            }
        }
    }

    // Get the list of euthanized pets for the specific user
    public List<Long> getEuthanizedPetIds(Long potentialOwnerId) {
        Optional<Grief> grief = griefRepository.findByPotentialOwnerId(potentialOwnerId);
        return grief.map(Grief::getEuthanizedPets).orElse(List.of());
    }

    // Add a pet ID to the euthanized pets list for the specific user
    public void updateEuthanizedPetIds(Long potentialOwnerId, Long petId) {
        Optional<Grief> grief = griefRepository.findByPotentialOwnerId(potentialOwnerId);
        if (grief.isPresent()) {
            Grief griefRecord = grief.get();
            List<Long> euthanizedPets = griefRecord.getEuthanizedPets();
            if (!euthanizedPets.contains(petId)) {
                euthanizedPets.add(petId);
                griefRecord.setEuthanizedPets(euthanizedPets);
                griefRepository.save(griefRecord);
            }
        } else {
            // If there's no Grief entry for the user, create a new one with the euthanized pet
            Grief newGrief = new Grief();
            newGrief.setPotentialOwnerId(potentialOwnerId);
            newGrief.setEuthanizedPets(List.of(petId));
            griefRepository.save(newGrief);
        }
    }

    // Remove a pet ID from the euthanized pets list for the specific user
    public void removeEuthanizedPetId(Long potentialOwnerId, Long petId) {
        Optional<Grief> grief = griefRepository.findByPotentialOwnerId(potentialOwnerId);
        if (grief.isPresent()) {
            Grief griefRecord = grief.get();
            List<Long> euthanizedPets = griefRecord.getEuthanizedPets();
            if (euthanizedPets.contains(petId)) {
                euthanizedPets.remove(petId);
                griefRecord.setEuthanizedPets(euthanizedPets);
                griefRepository.save(griefRecord);
            }
        }
    }
}
