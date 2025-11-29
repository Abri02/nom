package com.nom.api.adapters.`in`.http.controllers

import com.nom.api.domain.ports.out.UserRepository
import com.nom.api.security.JwtUtil
import com.nom.api.domain.user.entities.User
import com.nom.api.domain.user.entities.UserRole
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.*
import java.time.LocalDateTime
import java.util.UUID

/**
 * Simple Authentication Controller
 */
@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtUtil: JwtUtil
) {

    @PostMapping("/register")
    suspend fun register(@RequestBody request: RegisterRequest): ResponseEntity<AuthResponse> {
        try {
            // Check if user already exists
            val existingUser = userRepository.findByEmail(request.email)
            if (existingUser != null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(AuthResponse(null, null, "User with this email already exists", UserRole.UNKNOWN, null))
            }

            // Validate password
            if (request.password.length < 8) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(AuthResponse(null, null, "Password must be at least 8 characters long", UserRole.UNKNOWN, null))
            }

            // Create new user
            val user = User(
                id = UUID.randomUUID().toString(),
                name = request.name,
                email = request.email,
                passwordHash = passwordEncoder.encode(request.password),
                phoneNumber = request.phoneNumber,
                role = request.role ?: UserRole.CUSTOMER,
                createdAt = LocalDateTime.now()
            )

            userRepository.save(user)

            // Generate token
            val token = jwtUtil.generateToken(user.email)

            return ResponseEntity.status(HttpStatus.CREATED)
                .body(AuthResponse(token, user.email, "Registration successful", user.role, user.id))
        } catch (e: Exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(AuthResponse(null, null, "Registration failed: ${e.message}", UserRole.UNKNOWN, null))
        }
    }

    @PostMapping("/login")
    suspend fun login(@RequestBody request: LoginRequest): ResponseEntity<AuthResponse> {
        try {
            val user = userRepository.findByEmail(request.email)
                ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(AuthResponse(null, null, "Invalid credentials",  UserRole.UNKNOWN, null),)

            if (!passwordEncoder.matches(request.password, user.passwordHash)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(AuthResponse(null, null, "Invalid credentials", UserRole.UNKNOWN, null))
            }

            val token = jwtUtil.generateToken(user.id, user.email)

            return ResponseEntity.ok(AuthResponse(token, user.email, "Login successful", user.role, user.id))
        } catch (e: Exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(AuthResponse(null, null, "Login failed: ${e.message}", UserRole.UNKNOWN, null))
        }
    }
}

data class RegisterRequest(
    val name: String,
    val email: String,
    val password: String,
    val phoneNumber: String,
    val role: UserRole? = UserRole.CUSTOMER
)

data class LoginRequest(
    val email: String,
    val password: String
)

data class AuthResponse(
    val token: String?,
    val email: String?,
    val message: String,
    val role: UserRole,
    val id: String?,
)
