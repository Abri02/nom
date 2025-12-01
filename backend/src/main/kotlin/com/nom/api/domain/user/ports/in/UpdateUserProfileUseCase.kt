package com.nom.api.domain.user.ports.`in`

import com.nom.api.adapters.`in`.http.controllers.UserProfileResponse
import com.nom.api.domain.user.entities.User

interface UpdateUserProfileUseCase {
    suspend fun updateUserProfile(request: UpdateUserProfileRequest): UserProfileResponse
}

data class UpdateUserProfileRequest(
    val id: String,
    val name: String,
    val email: String,
    val phoneNumber: String,
    val zipCode : String,
    val city: String,
    val street: String,
    val streetNumber: String,
    val description: String?
)