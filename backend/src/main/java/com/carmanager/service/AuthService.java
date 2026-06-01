package com.carmanager.service;

import com.carmanager.dto.AuthResponse;
import com.carmanager.dto.LoginRequest;
import com.carmanager.dto.RegisterRequest;
import com.carmanager.dto.UserResponse;
import com.carmanager.exception.EmailAlreadyUsedException;
import com.carmanager.model.User;
import com.carmanager.repository.UserRepository;
import com.carmanager.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new EmailAlreadyUsedException("Ya existe una cuenta con ese correo");
        }

        User user = User.builder()
                .name(request.name().trim())
                .email(email)
                .password(passwordEncoder.encode(request.password()))
                .build();

        User saved = userRepository.save(user);
        String token = jwtService.generateToken(saved.getEmail());
        return AuthResponse.of(token, UserResponse.from(saved));
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.email().trim().toLowerCase();

        // Lanza BadCredentialsException si las credenciales no son validas.
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.password()));

        User user = userRepository.findByEmail(email).orElseThrow();
        String token = jwtService.generateToken(user.getEmail());
        return AuthResponse.of(token, UserResponse.from(user));
    }
}
