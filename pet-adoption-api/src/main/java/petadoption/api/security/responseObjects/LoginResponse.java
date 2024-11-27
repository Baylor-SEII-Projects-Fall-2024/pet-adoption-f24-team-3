package petadoption.api.security.responseObjects;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponse {

    private String token;

    private Long expiresIn;
    private Long userId;

}
