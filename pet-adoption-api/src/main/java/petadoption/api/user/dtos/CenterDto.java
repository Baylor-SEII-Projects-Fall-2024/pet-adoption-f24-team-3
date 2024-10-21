package petadoption.api.user.dtos;

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class CenterDto extends UserDto {
    private String name;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private String description;
}
