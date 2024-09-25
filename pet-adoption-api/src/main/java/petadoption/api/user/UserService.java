package petadoption.api.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PotentialOwnerRepository potentialOwnerRepository;
    @Autowired
    private AdoptionCenterRepository adoptionCenterRepository;


    public List<User> findAllUsers(){ return userRepository.findAll();}
    public Optional<User> findUser(Long userId) {
        return userRepository.findById(userId);
    }
    public Optional<AdoptionCenter> findAdoptionCenter(Long userId) {return adoptionCenterRepository.findById(userId);}
    public Optional<PotentialOwner> findPotentialOwner(Long userId) {return potentialOwnerRepository.findById(userId);}

    public User saveUser(User user) {
        return userRepository.save(user);
    }
}
