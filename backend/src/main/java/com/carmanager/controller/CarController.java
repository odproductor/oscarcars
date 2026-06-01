package com.carmanager.controller;

import com.carmanager.dto.CarRequest;
import com.carmanager.dto.CarResponse;
import com.carmanager.security.CustomUserDetails;
import com.carmanager.service.CarService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cars")
@RequiredArgsConstructor
public class CarController {

    private final CarService carService;

    @GetMapping
    public List<CarResponse> list(@AuthenticationPrincipal CustomUserDetails user) {
        return carService.listForUser(user.getId());
    }

    @PostMapping
    public ResponseEntity<CarResponse> create(@AuthenticationPrincipal CustomUserDetails user,
                                              @Valid @RequestBody CarRequest request) {
        CarResponse created = carService.create(user.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public CarResponse update(@AuthenticationPrincipal CustomUserDetails user,
                              @PathVariable Long id,
                              @Valid @RequestBody CarRequest request) {
        return carService.update(user.getId(), id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal CustomUserDetails user,
                                       @PathVariable Long id) {
        carService.delete(user.getId(), id);
        return ResponseEntity.noContent().build();
    }
}
