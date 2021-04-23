package com.example.mydriveapi.controller;

import com.example.mydriveapi.domain.DocumentProperties;
import com.example.mydriveapi.other.Search;
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

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

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
    public ResponseEntity uploadFile(@RequestParam("files") List<MultipartFile> files, @RequestHeader("Authorization") String token) {
        String message = "";
        boolean fail = false;
        List<String> filesError = new ArrayList<String>();

        for (MultipartFile file: files){
            try {
                documentStorageService.save(file, getUsername(token));
            } catch (Exception e) {
                if (!fail)
                    fail = true;
                filesError.add(file.getOriginalFilename());
            }
        }

        if (fail){
            String joined = filesError.stream()
                    .map(plain -> "\"" + plain + "\"")
                    .collect(Collectors.joining(","));
            message = "Could not upload files: " + joined;
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(message);
        }
        message = "Files uploaded successfully";
        return ResponseEntity.status(HttpStatus.OK).body(message);
    }

    @PostMapping("/download/{documentId}")
    public ResponseEntity downloadFile(@PathVariable Long documentId, @RequestHeader("Authorization") String token)
            throws Exception {
        Resource resource = documentStorageService.loadFile(documentId, getUsername(token));
        if (resource == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("File not found");

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(documentStorageService.getDocumentProperties(documentId, getUsername(token)).getDocumentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @PostMapping("/files")
    public ResponseEntity<List<DocumentProperties>> getListFiles(@RequestHeader("Authorization") String token, @RequestBody Search search) {
        List<DocumentProperties> documents = documentStorageService.getAllDocumentProperties(getUsername(token));
        List<DocumentProperties> response = new ArrayList<DocumentProperties>();
        for (DocumentProperties i: documents)
            if(i.getFileName().toUpperCase().contains(search.getSearch().toUpperCase()))
                response.add(i);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/files/{documentId}")
    public ResponseEntity getFile(@PathVariable Long documentId, @RequestHeader("Authorization") String token) {
        DocumentProperties documentProperties = documentStorageService.getDocumentProperties(documentId,getUsername(token));

        if (documentProperties == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("File not found");

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION).body(documentProperties);
    }
}
