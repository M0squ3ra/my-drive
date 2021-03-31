package com.example.mydriveapi.service;

import com.example.mydriveapi.data.DocumentPropertiesRepository;
import com.example.mydriveapi.data.UserRepository;
import com.example.mydriveapi.domain.DocumentProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class DocumentStorageService {
    private final Path uploadDir;

    @Autowired
    private DocumentPropertiesRepository documentPropertiesRepository;

    @Autowired
    private UserRepository userRepository;

    public DocumentStorageService(@Value("${storage.dir}") String dir) {
        this.uploadDir = Paths.get(dir);
    }

    @PostConstruct
    public void init() {
        try {
            Files.createDirectory(uploadDir);
        } catch (IOException e) {
        }
    }

    public void save(MultipartFile file, String username) {
        try {
            Files.copy(file.getInputStream(), this.uploadDir.resolve(username + "/" + file.getOriginalFilename()).toAbsolutePath());
            DocumentProperties documentProperties = new DocumentProperties();
            documentProperties.setUserId(userRepository.findByUserName(username).getId());
            documentProperties.setFileName(file.getOriginalFilename());
            documentProperties.setDocumentType(file.getContentType());
            documentProperties.setUploadDir(this.uploadDir.resolve(username + "/" + file.getOriginalFilename()).toString());
            documentPropertiesRepository.save(documentProperties);
        } catch (Exception e) {
            throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
        }
    }

    public DocumentProperties getDocumentProperties(Long documentId, String username) {
        DocumentProperties documentProperties = documentPropertiesRepository.findByDocumentIdAndUserId(documentId,userRepository.findByUserName(username).getId());
        return documentProperties;
    }

    public void deleteAll() {
        FileSystemUtils.deleteRecursively(uploadDir.toFile());
    }

    public List<DocumentProperties> getAllDocumentProperties(String username) {
        return documentPropertiesRepository.findByUserId(userRepository.findByUserName(username).getId());
    }

    public Path getUploadDir() {
        return uploadDir;
    }
}
