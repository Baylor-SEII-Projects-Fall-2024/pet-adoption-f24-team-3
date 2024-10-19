package petadoption.api.event;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Data
@Entity
@Getter
@Setter
@EqualsAndHashCode()
public class Event {
    public static final String TABLE_NAME = "EVENTS";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "CENTER_ID")
    private Long centerId;

    @Column(name = "DATE_POSTED")
    private Date datePosted;

    @Column(name = "NAME")
    private String name;

    @Column(name = "DESCRIPTION")
    private String description;

    @Column(name = "DATE_START")
    private Date dateStart;

    @Column(name = "DATE_END")
    private Date dateEnd;

    @Column(name = "THUMBNAIL_PATH")
    private String thumbnailPath;

}