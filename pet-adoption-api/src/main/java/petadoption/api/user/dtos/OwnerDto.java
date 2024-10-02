package petadoption.api.user.dtos;

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class OwnerDto extends UserDto {
    private String nameFirst;
    private String nameLast;
}
