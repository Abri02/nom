package com.nom.api.adapters.`in`.http.controllers

import com.nom.api.domain.menu.entities.Menu
import com.nom.api.domain.menu.entities.RestaurantProfile
import com.nom.api.domain.user.entities.UserRole
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
    suspend fun createUser(@RequestBody request: CreateUserHttpRequest): ResponseEntity<Any> {
        return try {

            if (request.role == UserRole.RESTAURANT && request.restaurantProfile == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ErrorResponse("Restaurant profile is required for RESTAURANT users"))
            }

            val restaurantProfileDomain = request.restaurantProfile?.let {
                RestaurantProfile(
                    restaurantName = it.restaurantName,
                    openingHours = it.openingHours,
                    menu = Menu() // induláskor üres menü
                )
            }

            val createUserRequest = CreateUserRequest(
                name = request.name,
                email = request.email,
                password = request.password,
                phoneNumber = request.phoneNumber,
                role = request.role,
                ZipCode = request.zipCode,
                City = request.city,
                Street =  request.street,
                StreetNumber =  request.streetNumber,
                restaurantProfile = restaurantProfileDomain
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

            ResponseEntity.status(HttpStatus.CREATED).body(response)
        } catch (e: IllegalArgumentException) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ErrorResponse(e.message ?: "Bad request"))
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ErrorResponse("Internal server error"))
        }
    }
}

data class CreateUserHttpRequest(
    val name: String,
    val email: String,
    val password: String,
    val phoneNumber: String,
    val zipCode : String,
    val city: String,
    val street: String,
    val streetNumber: String,
    val role: UserRole,
    val restaurantProfile: RestaurantProfileHttpRequest? = null
)

data class RestaurantProfileHttpRequest(
    val restaurantName: String,
    val openingHours: String? = null
)

data class UserResponse(
    val id: String,
    val name: String,
    val email: String,
    val phoneNumber: String,
    val role: UserRole,
    val createdAt: String
)

data class ErrorResponse(
    val message: String
)
