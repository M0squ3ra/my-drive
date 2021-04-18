package com.example.mydriveapi.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
@Data
public class DocumentProperties {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long documentId;
    @JsonIgnore
    private Long userId;
    private String fileName;
    private String documentType;
    @JsonIgnore
    private String uploadDir;

//    public (boolean) and link
}
