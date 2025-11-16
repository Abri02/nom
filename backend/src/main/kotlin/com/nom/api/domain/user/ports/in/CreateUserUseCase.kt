package com.nom.api.domain.ports.`in`

import com.nom.api.domain.menu.entities.RestaurantProfile
import com.nom.api.domain.user.entities.User
import com.nom.api.domain.user.entities.UserRole

/**
 * Input port for creating a new user
 */
interface CreateUserUseCase {
    suspend fun execute(request: CreateUserRequest): User
}

/**
 * Request data for creating a user
 */
data class CreateUserRequest(
    val name: String,
    val email: String,
    val password: String,
    val phoneNumber: String,
    val role: UserRole,
    val restaurantProfile: RestaurantProfile? = null
)
