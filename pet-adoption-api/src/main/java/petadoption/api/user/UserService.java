package petadoption.api.user;

import jakarta.transaction.Transactional;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import petadoption.api.user.dtos.LoginDto;
import petadoption.api.user.dtos.UserDto;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

@Log4j2
@Service
public class UserService {
    // Inject repositories and password encoder
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PotentialOwnerRepository potentialOwnerRepository;
    @Autowired
    private AdoptionCenterRepository adoptionCenterRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> findAllUsers(){ return userRepository.findAll();}
    public Optional<User> findUser(Long userId) {
        return userRepository.findById(userId);
    }
    public Optional<AdoptionCenter> findAdoptionCenter(Long userId) {return adoptionCenterRepository.findById(userId);}
    public Optional<PotentialOwner> findPotentialOwner(Long userId) {return potentialOwnerRepository.findById(userId);}
    public Optional<User> findUserByEmail(String userEmail){return userRepository.findUserByEmailAddress(userEmail);}

    public boolean registerUser(UserDto userDto) {
        // Encode password using BCrypt
        String encodedPassword = passwordEncoder.encode(userDto.getPassword());

        // Set user info
        User user = new User();
        user.setEmailAddress(userDto.getEmailAddress());
        user.setPassword(encodedPassword);

        // Check for existing users with the same email address
        if (userRepository.findUserByEmailAddress(user.getEmailAddress()).isPresent()) {
            log.warn("Duplicate user attempt for email: {}", user.getEmailAddress());
            return false;
        }

        // Save the user to the database
        User savedUser = userRepository.save(user);

        // Return status of registration
        return savedUser.getId() != null;
    }

    public Map<String, Long> loginUser(LoginDto loginDto) {
        // See if there is a user under the email provided
        var userOptional = findUserByEmail(loginDto.getEmailAddress());
        // If user not found, return false and log it
        if (userOptional.isEmpty()) {
            log.warn("Username not found for login: {}", loginDto.getEmailAddress());
            return new HashMap<String, Long>(){
                {put("Email does not exist", -1L);}
            };
        }

        // Extract user from optional
        User user = userOptional.get();

        // Compare encoded password with the one provided
        if(! passwordEncoder.matches(loginDto.getPassword(), user.getPassword())) {
            return new HashMap<String, Long>(){
                {put("Invalid password", -1L);}
            };
        }
        return new HashMap<String, Long>(){
            {put("userid", user.id);}
        };
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    // USED TO CLEAR TABLE FOR TESTING: See misc/ClearDataController
    @Transactional
    public void clearData() {
        userRepository.deleteAll();
    }

}
