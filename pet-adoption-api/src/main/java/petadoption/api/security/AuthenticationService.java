package petadoption.api.security;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import petadoption.api.security.requestObjects.CenterDto;
import petadoption.api.security.requestObjects.LoginDto;
import petadoption.api.security.requestObjects.OwnerDto;
import petadoption.api.user.*;

@Log4j2
@Service
public class AuthenticationService {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User loginUser(LoginDto loginDto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDto.getEmailAddress(),
                        loginDto.getPassword()
                )
        );

        return userService.findUserByEmail(loginDto.getEmailAddress())
                .orElseThrow();
    }

    // Check if old password matches stored password -- used for password change preverification
    public boolean checkOldPassword(Long userId, String oldPassword) {
        User user = userService.findUser(userId)
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

        userService.updateAdoptionCenter(new CenterDto(), center.getId());

        return true;
    }

    // Helper method to update Potential Owner's password
    private boolean updatePotentialOwnerPassword(PotentialOwner owner, String newPassword) {
        String encodedPassword = passwordEncoder.encode(newPassword);
        owner.setPassword(encodedPassword);

        userService.updatePotentialOwner(new OwnerDto(), owner.getId());

        return true;
    }
}
