package com.carmanager.service;

import com.carmanager.dto.CarRequest;
import com.carmanager.dto.CarResponse;
import com.carmanager.exception.BusinessException;
import com.carmanager.exception.ResourceNotFoundException;
import com.carmanager.model.Car;
import com.carmanager.model.User;
import com.carmanager.repository.CarRepository;
import com.carmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Year;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CarService {

    private final CarRepository carRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<CarResponse> listForUser(Long userId) {
        return carRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(CarResponse::from)
                .toList();
    }

    @Transactional
    public CarResponse create(Long userId, CarRequest request) {
        validateYear(request.year());

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        Car car = Car.builder()
                .brand(request.brand().trim())
                .model(request.model().trim())
                .year(request.year())
                .plate(request.plate().trim().toUpperCase())
                .color(request.color().trim())
                .photoUrl(request.photoUrl())
                .user(user)
                .build();

        return CarResponse.from(carRepository.save(car));
    }

    @Transactional
    public CarResponse update(Long userId, Long carId, CarRequest request) {
        validateYear(request.year());

        Car car = carRepository.findByIdAndUserId(carId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Auto no encontrado"));

        car.setBrand(request.brand().trim());
        car.setModel(request.model().trim());
        car.setYear(request.year());
        car.setPlate(request.plate().trim().toUpperCase());
        car.setColor(request.color().trim());
        car.setPhotoUrl(request.photoUrl());

        return CarResponse.from(carRepository.save(car));
    }

    @Transactional
    public void delete(Long userId, Long carId) {
        Car car = carRepository.findByIdAndUserId(carId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Auto no encontrado"));
        carRepository.delete(car);
    }

    private void validateYear(Integer year) {
        int current = Year.now().getValue();
        if (year != null && year > current) {
            throw new BusinessException("El anio del auto no puede ser futuro (maximo " + current + ")");
        }
    }
}
