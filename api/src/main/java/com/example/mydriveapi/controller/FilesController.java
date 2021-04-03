package com.example.mydriveapi.controller;

import com.example.mydriveapi.domain.DocumentProperties;
import com.example.mydriveapi.security.jwt.JwtTokenUtil;
import com.example.mydriveapi.service.DocumentStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
public class FilesController {
    @Autowired
    DocumentStorageService documentStorageService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    private String getUsername(String token){
        token = token.substring(7);
        return jwtTokenUtil.getUsernameFromToken(token);
    }

    @PostMapping("/upload")
    public ResponseEntity uploadFile(@RequestParam("file") MultipartFile file, @RequestHeader("Authorization") String token) {
        String message = "";
        try {
            documentStorageService.save(file, getUsername(token));
            message = "Uploaded the file successfully: " + file.getOriginalFilename();
            return ResponseEntity.status(HttpStatus.OK).body(message);
        } catch (Exception e) {
            message = "Could not upload the file: " + file.getOriginalFilename() + "!";
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(message);
        }
    }

    @PostMapping("/download/{documentId}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long documentId, @RequestHeader("Authorization") String token)
            throws Exception {
        Resource resource = documentStorageService.loadFile(documentId, getUsername(token));
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(documentStorageService.getDocumentProperties(documentId, getUsername(token)).getDocumentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @GetMapping("/files")
    public ResponseEntity<List<DocumentProperties>> getListFiles(@RequestHeader("Authorization") String token) {
        List<DocumentProperties> documents = documentStorageService.getAllDocumentProperties(getUsername(token));
        return ResponseEntity.status(HttpStatus.OK).body(documents);
    }

    @GetMapping("/files/{documentId}")
    public ResponseEntity getFile(@PathVariable Long documentId, @RequestHeader("Authorization") String token) {
        DocumentProperties file = documentStorageService.getDocumentProperties(documentId,getUsername(token));

        if (file == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("File not found");

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION).body(file);
    }
}
