package petadoption.api.security.requestObjects;

import lombok.Data;

@Data
public class LoginDto {
    private String emailAddress;
    private String password;
}
