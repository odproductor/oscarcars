package com.carmanager.dto;

import com.carmanager.model.Car;

public record CarResponse(
        Long id,
        String brand,
        String model,
        Integer year,
        String plate,
        String color,
        String photoUrl
) {
    public static CarResponse from(Car car) {
        return new CarResponse(
                car.getId(),
                car.getBrand(),
                car.getModel(),
                car.getYear(),
                car.getPlate(),
                car.getColor(),
                car.getPhotoUrl()
        );
    }
}
