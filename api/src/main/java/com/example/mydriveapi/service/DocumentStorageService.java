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
import java.io.FileNotFoundException;
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
            documentProperties.setUploadDir(username + "/" + file.getOriginalFilename());
            documentPropertiesRepository.save(documentProperties);
        } catch (Exception e) {
            throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
        }
    }

    public DocumentProperties getDocumentProperties(Long documentId, String username) {
        DocumentProperties documentProperties = documentPropertiesRepository.findByDocumentIdAndUserId(documentId,userRepository.findByUserName(username).getId());
        return documentProperties;
    }

    public List<DocumentProperties> getAllDocumentProperties(String username) {
        return documentPropertiesRepository.findByUserId(userRepository.findByUserName(username).getId());
    }

    public Resource loadFile(Long id, String username) throws Exception {
        DocumentProperties documentPropertie = documentPropertiesRepository.findByDocumentIdAndUserId(id,userRepository.findByUserName(username).getId());
        if (documentPropertie != null) {
            try {
                Path path = this.uploadDir.resolve(documentPropertie.getUploadDir());
                Resource resource = new UrlResource(path.toUri());
                return resource;
            } catch (Exception e) {
            }
        }
        return null;
    }

    public Path getUploadDir() {
        return uploadDir;
    }
}
