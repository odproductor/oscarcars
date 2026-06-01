package com.carmanager.exception;

/**
 * Error de regla de negocio que se devuelve como 400 con mensaje claro
 * (ej: el anio del auto no puede ser futuro).
 */
public class BusinessException extends RuntimeException {
    public BusinessException(String message) {
        super(message);
    }
}
