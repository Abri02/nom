package com.nom.api.adapters.`in`.http.controllers

import com.nom.api.domain.ports.out.UserRepository
import com.nom.api.security.JwtUtil
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.*

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

    @PostMapping("/login")
    suspend fun login(@RequestBody request: LoginRequest): ResponseEntity<LoginResponse> {
        try {
            val user = userRepository.findByEmail(request.email)
                ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(LoginResponse(null, "Invalid credentials"))

            if (!passwordEncoder.matches(request.password, user.passwordHash)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(LoginResponse(null, "Invalid credentials"))
            }

            val token = jwtUtil.generateToken(user.email)

            return ResponseEntity.ok(LoginResponse(token, "Login successful"))
        } catch (e: Exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(LoginResponse(null, "Login failed: ${e.message}"))
        }
    }
}

data class LoginRequest(
    val email: String,
    val password: String
)

data class LoginResponse(
    val token: String?,
    val message: String
)
