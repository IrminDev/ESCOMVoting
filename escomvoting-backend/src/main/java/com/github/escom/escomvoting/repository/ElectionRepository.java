package com.github.escom.escomvoting.repository;

import com.github.escom.escomvoting.model.entity.Election;
import com.github.escom.escomvoting.model.entity.ElectionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ElectionRepository extends JpaRepository<Election, UUID> {
    List<Election> findAllByStatus(ElectionStatus status);

    @Query(value = "SELECT * FROM elections e WHERE e.status = 'OPEN' AND :role = ANY(e.allowed_roles) ORDER BY e.start_date DESC",
           countQuery = "SELECT count(*) FROM elections e WHERE e.status = 'OPEN' AND :role = ANY(e.allowed_roles)",
           nativeQuery = true)
    Page<Election> findOpenElectionsForRole(@Param("role") String role, Pageable pageable);

    Page<Election> findAllByStatusIn(List<ElectionStatus> statuses, Pageable pageable);
}
