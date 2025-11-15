package com.nom.api.adapters.`in`.http.controllers

import domain.entities.UserRole
import com.nom.api.domain.ports.`in`.CreateUserRequest
import com.nom.api.domain.ports.`in`.CreateUserUseCase
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

/**
 * Input Adapter - HTTP Controller for User operations
 */
@RestController
@RequestMapping("/api/users")
class UserController(
    private val createUserUseCase: CreateUserUseCase
) {

    @PostMapping
    suspend fun createUser(@RequestBody request: CreateUserHttpRequest): ResponseEntity<UserResponse> {
        try {
            val createUserRequest = CreateUserRequest(
                name = request.name,
                email = request.email,
                password = request.password,
                phoneNumber = request.phoneNumber,
                role = request.role,
            )

            val user = createUserUseCase.execute(createUserRequest)

            val response = UserResponse(
                id = user.id,
                name = user.name,
                email = user.email,
                phoneNumber = user.phoneNumber,
                role = user.role,
                createdAt = user.createdAt.toString()
            )

            return ResponseEntity.status(HttpStatus.CREATED).body(response)
        } catch (e: IllegalArgumentException) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build()
        } catch (e: Exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()
        }
    }
}

data class CreateUserHttpRequest(
    val name: String,
    val email: String,
    val password: String,
    val phoneNumber: String,
    val role: UserRole,
)

data class UserResponse(
    val id: String,
    val name: String,
    val email: String,
    val phoneNumber: String,
    val role: UserRole,
    val createdAt: String
)
