package petadoption.api.security.requestObjects;

import lombok.Data;

@Data
public class ChangePasswordDto {
    private String newPassword;
}
