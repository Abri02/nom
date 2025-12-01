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

@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtUtil: JwtUtil
) {

    @PostMapping("/login")
    suspend fun login(@RequestBody request: LoginRequest): ResponseEntity<AuthResponse> {
        try {
            val user = userRepository.findByEmail(request.email)
                ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(AuthResponse(null, null, "Invalid credentials",  UserRole.UNKNOWN, null, null),)

            if (!passwordEncoder.matches(request.password, user.passwordHash)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(AuthResponse(null, null, "Invalid credentials", UserRole.UNKNOWN, null, null))
            }

            val token = jwtUtil.generateToken(user.id, user.email)

            return ResponseEntity.ok(AuthResponse(token, user.email, "Login successful", user.role, user.id, user.name))
        } catch (e: Exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(AuthResponse(null, null, "Login failed: ${e.message}", UserRole.UNKNOWN, null, null))
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
    val name: String?
)
