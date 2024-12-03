package petadoption.api.user;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import petadoption.api.recommendations.RecommendationsService;
import petadoption.api.security.requestObjects.CenterDto;
import petadoption.api.security.requestObjects.LoginDto;
import petadoption.api.security.requestObjects.OwnerDto;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
    @Lazy
    private PasswordEncoder passwordEncoder;
    @Autowired
    @Lazy
    private RecommendationsService recommendationsService;

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> findUser(Long userId) {
        return userRepository.findById(userId);
    }

    public Optional<AdoptionCenter> findAdoptionCenter(Long userId) {
        return adoptionCenterRepository.findById(userId);
    }

    public Optional<PotentialOwner> findPotentialOwner(Long userId) {
        return potentialOwnerRepository.findById(userId);
    }

    public Optional<User> findUserByEmail(String userEmail) {
        return userRepository.findUserByEmailAddress(userEmail);
    }

    public PotentialOwner registerOwner(OwnerDto ownerDto) {
        // Encode password using BCrypt
        String encodedPassword = passwordEncoder.encode(ownerDto.getPassword());

        // Set PotentialOwner info
        PotentialOwner potentialOwner = getPotentialOwner(ownerDto, encodedPassword);

        // Check for existing users with the same email address
        if (potentialOwnerRepository.findPotentialOwnerByEmailAddress(potentialOwner.getEmailAddress()).isPresent()) {
            log.warn("Duplicate owner attempt for email: {}", potentialOwner.getEmailAddress());
            return null;
        }

        // Save the user to the database
        PotentialOwner savedUser = potentialOwnerRepository.save(potentialOwner);
        recommendationsService.createHistory(savedUser.getId());

        // Return status of registration
        return savedUser;
    }

    private static PotentialOwner getPotentialOwner(OwnerDto ownerDto, String encodedPassword) {
        PotentialOwner potentialOwner = new PotentialOwner();
        potentialOwner.setEmailAddress(ownerDto.getEmailAddress());
        potentialOwner.setPassword(encodedPassword);
        potentialOwner.setProfilePicPath(ownerDto.getProfilePicPath());
        potentialOwner.setAccountType(ownerDto.getAccountType());
        potentialOwner.setNameFirst(ownerDto.getNameFirst());
        potentialOwner.setNameLast(ownerDto.getNameLast());
        return potentialOwner;
    }

    public Long updatePotentialOwner(OwnerDto ownerDto, Long ownerID) {
        PotentialOwner updateOwner = potentialOwnerRepository.findById(ownerID)
                .orElseThrow(() -> new EntityNotFoundException("Potential owner not found with ID: " + ownerID));

        if (ownerDto.getPassword() != null && !ownerDto.getPassword().isEmpty()) {
            String encodedPassword = passwordEncoder.encode(ownerDto.getPassword());
            updateOwner.setPassword(encodedPassword);
        }
        if (ownerDto.getEmailAddress() != null && !ownerDto.getEmailAddress().isEmpty()) {
            updateOwner.setEmailAddress(ownerDto.getEmailAddress());
        }
        if (ownerDto.getProfilePicPath() != null && !ownerDto.getProfilePicPath().isEmpty()) {
            updateOwner.setProfilePicPath(ownerDto.getProfilePicPath());
        }
        if (ownerDto.getAccountType() != null && !ownerDto.getAccountType().isEmpty()) {
            updateOwner.setAccountType(ownerDto.getAccountType());
        }
        if (ownerDto.getNameFirst() != null && !ownerDto.getNameFirst().isEmpty()) {
            updateOwner.setNameFirst(ownerDto.getNameFirst());
        }
        if (ownerDto.getNameLast() != null && !ownerDto.getNameLast().isEmpty()) {
            updateOwner.setNameLast(ownerDto.getNameLast());

        }

        return potentialOwnerRepository.save(updateOwner).getId();
    }

    public AdoptionCenter registerCenter(CenterDto centerDto) {
        // Encode password using BCrypt
        String encodedPassword = passwordEncoder.encode(centerDto.getPassword());

        // Set user info
        AdoptionCenter adoptionCenter = getAdoptionCenter(centerDto, encodedPassword);

        // Check for existing users with the same email address
        if (adoptionCenterRepository.findAdoptionCenterByEmailAddress(adoptionCenter.getEmailAddress()).isPresent()) {
            log.warn("Duplicate center attempt for email: {}", adoptionCenter.getEmailAddress());
            return null;
        }

        // Save the user to the database
        AdoptionCenter savedUser = adoptionCenterRepository.save(adoptionCenter);
        recommendationsService.createHistory(savedUser.getId());
        // Return status of registration
        return savedUser;
    }

    private static AdoptionCenter getAdoptionCenter(CenterDto centerDto, String encodedPassword) {
        AdoptionCenter adoptionCenter = new AdoptionCenter();
        adoptionCenter.setEmailAddress(centerDto.getEmailAddress());
        adoptionCenter.setPassword(encodedPassword);
        adoptionCenter.setAccountType(centerDto.getAccountType());
        adoptionCenter.setProfilePicPath(centerDto.getProfilePicPath());
        adoptionCenter.setName(centerDto.getName());
        adoptionCenter.setAddress(centerDto.getAddress());
        adoptionCenter.setCity(centerDto.getCity());
        adoptionCenter.setState(centerDto.getState());
        adoptionCenter.setZipCode(centerDto.getZipCode());
        return adoptionCenter;
    }

    public Long updateAdoptionCenter(CenterDto centerDto, Long centerID) {
        AdoptionCenter updateCenter = adoptionCenterRepository.findById(centerID)
                .orElseThrow(() -> new EntityNotFoundException("Adoption center not found with ID: " + centerID));

        if (centerDto.getPassword() != null && !centerDto.getPassword().isEmpty()) {
            String encodedPassword = passwordEncoder.encode(centerDto.getPassword());
            updateCenter.setPassword(encodedPassword);
        }
        if (centerDto.getAccountType() != null && !centerDto.getAccountType().isEmpty()) {
            updateCenter.setAccountType(centerDto.getAccountType());
        }
        if (centerDto.getProfilePicPath() != null) {
            updateCenter.setProfilePicPath(centerDto.getProfilePicPath());
        }
        if (centerDto.getName() != null && !centerDto.getName().isEmpty()) {
            updateCenter.setName(centerDto.getName());
        }
        if (centerDto.getAddress() != null && !centerDto.getAddress().isEmpty()) {
            updateCenter.setAddress(centerDto.getAddress());
        }
        if (centerDto.getCity() != null && !centerDto.getCity().isEmpty()) {
            updateCenter.setCity(centerDto.getCity());
        }
        if (centerDto.getState() != null && !centerDto.getState().isEmpty()) {
            updateCenter.setState(centerDto.getState());
        }
        if (centerDto.getZipCode() != null && !centerDto.getZipCode().isEmpty()) {
            updateCenter.setZipCode(centerDto.getZipCode());
        }
        if (centerDto.getEmailAddress() != null && !centerDto.getEmailAddress().isEmpty()) {
            updateCenter.setEmailAddress(centerDto.getEmailAddress());
        }
        if (centerDto.getDescription() != null && !centerDto.getDescription().isEmpty()) {
            updateCenter.setDescription(centerDto.getDescription());
        }

        return adoptionCenterRepository.save(updateCenter).getId();
    }

    public Map<String, Object> getCenterDetails(Long centerId){
        Map<String, Object> details = new HashMap<>();
        AdoptionCenter adoptionCenter = adoptionCenterRepository.findById(centerId).orElseThrow(()
                -> new EntityNotFoundException("Adoption center not found with ID: " + centerId));
        details.put("id", adoptionCenter.getId());
        details.put("address", adoptionCenter.getAddress());
        details.put("city",adoptionCenter.getCity());
        details.put("state",adoptionCenter.getState());
        details.put("name", adoptionCenter.getName());

        return details;
    }

    public User saveUser(User user) {
        User savedUser = userRepository.save(user);
        recommendationsService.createHistory(savedUser.getId());
        return savedUser;
    }

    public List<AdoptionCenter> paginateCenters(Integer pageSize, Integer pageNumber) {
        Pageable pagingRequest = PageRequest.of(pageNumber, pageSize);
        return adoptionCenterRepository.findAll(pagingRequest).getContent();
    }

    // Check if old password matches stored password -- used for password change preverification
    public boolean checkOldPassword(Long userId, String oldPassword) {
        User user = findUser(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

        return passwordEncoder.matches(oldPassword, user.getPassword());
    }

    // Update a users password
    public boolean changePassword(User user, String newPassword) {
        // Check the user type and call the appropriate update method
        if (user instanceof AdoptionCenter) {
            return updateAdoptionCenterPassword((AdoptionCenter) user, newPassword);
        } else if (user instanceof PotentialOwner) {
            return updatePotentialOwnerPassword((PotentialOwner) user, newPassword);
        } else {
            throw new RuntimeException("Unsupported user type");
        }
    }

    // Helper method to update Adoption Center's password
    private boolean updateAdoptionCenterPassword(AdoptionCenter center, String newPassword) {
        String encodedPassword = passwordEncoder.encode(newPassword);
        center.setPassword(encodedPassword);

        updateAdoptionCenter(new CenterDto(), center.getId());

        return true;
    }

    // Helper method to update Potential Owner's password
    private boolean updatePotentialOwnerPassword(PotentialOwner owner, String newPassword) {
        String encodedPassword = passwordEncoder.encode(newPassword);
        owner.setPassword(encodedPassword);

        updatePotentialOwner(new OwnerDto(), owner.getId());

        return true;
    }

    // USED TO CLEAR TABLE FOR TESTING: See misc/ClearDataController
    @Transactional
    public void clearData() {
        userRepository.deleteAll();
    }

}
