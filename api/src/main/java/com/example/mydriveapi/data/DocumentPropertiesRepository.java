package com.example.mydriveapi.data;

import com.example.mydriveapi.domain.DocumentProperties;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentPropertiesRepository extends JpaRepository<DocumentProperties,Long> {
    DocumentProperties findByDocumentIdAndUserId(Long documentId, Long userId);
    List<DocumentProperties> findByUserId(Long userId);
}
