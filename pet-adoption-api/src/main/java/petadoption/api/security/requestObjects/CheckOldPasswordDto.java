package petadoption.api.security.requestObjects;

import lombok.Data;

@Data
public class CheckOldPasswordDto {
    private String oldPassword;
}
