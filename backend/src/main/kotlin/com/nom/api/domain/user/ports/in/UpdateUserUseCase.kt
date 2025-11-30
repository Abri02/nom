package com.nom.api.domain.user.ports.`in`

import com.nom.api.domain.user.entities.User
import com.nom.api.domain.user.entities.UserRole


interface UpdateUserUseCase {
    suspend fun updateUser(request: UpdateUserRequest): User
}

data class UpdateUserRequest(
    val id: String,
    val name: String,
    val email: String,
    val phoneNumber: String,
    val street: String,
    val streetNumber: String,
    val city: String,
    val zipCode: String,
    val role : UserRole
)