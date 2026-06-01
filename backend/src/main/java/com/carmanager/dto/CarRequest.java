package com.carmanager.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CarRequest(

        @NotBlank(message = "La marca es obligatoria")
        @Size(max = 60, message = "La marca no puede superar los 60 caracteres")
        String brand,

        @NotBlank(message = "El modelo es obligatorio")
        @Size(max = 60, message = "El modelo no puede superar los 60 caracteres")
        String model,

        @NotNull(message = "El anio es obligatorio")
        @Min(value = 1900, message = "El anio debe ser mayor o igual a 1900")
        Integer year,

        @NotBlank(message = "La placa es obligatoria")
        @Pattern(
                regexp = "^[A-Za-z]{3}-?[0-9]{3,4}$",
                message = "La placa debe tener un formato valido (ej: ABC-123)"
        )
        String plate,

        @NotBlank(message = "El color es obligatorio")
        @Size(max = 30, message = "El color no puede superar los 30 caracteres")
        String color,

        // Campo simulado, opcional.
        String photoUrl
) {
}
