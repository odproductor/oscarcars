package com.carmanager.repository;

import com.carmanager.model.Car;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CarRepository extends JpaRepository<Car, Long> {

    List<Car> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<Car> findByIdAndUserId(Long id, Long userId);
}
