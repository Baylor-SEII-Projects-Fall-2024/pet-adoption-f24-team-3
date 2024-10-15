package petadoption.api.user.dtos;

import lombok.Data;

@Data
public class UserDto {
    private String emailAddress;
    private String password;
    private String accountType;
    private String profilePicPath;
}
