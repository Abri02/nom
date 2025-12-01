package com.nom.api.domain.user.ports.`in`

import com.nom.api.domain.user.entities.User
import com.nom.api.domain.user.entities.UserRole

interface GetProfileByUserIdUseCase {
    fun getProfileByUserId(userId: String) : ProfileResponse?
}

data class ProfileResponse(
    val id: String,
    val name: String,
    val email: String,
    val phoneNumber: String,
    val street: String,
    val streetNumber: String,
    val city: String,
    val zipCode: String,
    val role : UserRole,
    val description: String?,
    val isSuspended: Boolean,
    val favouriteRestaurants: List<String>,
    val createdAt : String,
)

