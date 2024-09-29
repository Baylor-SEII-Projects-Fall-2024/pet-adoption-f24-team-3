package petadoption.api.user.dtos;

import lombok.Data;

@Data
public class LoginDto {
    private String emailAddress;
    private String password;
}
