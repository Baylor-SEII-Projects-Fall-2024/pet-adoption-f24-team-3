package petadoption.api.security.requestObjects;

import lombok.Data;

@Data
public class UserDto {
    private String emailAddress;
    private String password;
    private String accountType;
    private String profilePicPath;
}
