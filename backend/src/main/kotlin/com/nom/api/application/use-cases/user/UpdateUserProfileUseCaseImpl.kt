package com.nom.api.application.`use-cases`.user

import com.nom.api.adapters.`in`.http.controllers.UserProfileResponse
import com.nom.api.domain.ports.out.UserRepository
import com.nom.api.domain.user.ports.`in`.UpdateUserProfileRequest
import com.nom.api.domain.user.ports.`in`.UpdateUserProfileUseCase
import org.springframework.stereotype.Service

@Service
class UpdateUserProfileUseCaseImpl(
    private val userRepository: UserRepository
) : UpdateUserProfileUseCase {
    override suspend fun updateUserProfile(request: UpdateUserProfileRequest): UserProfileResponse {
        val existingUser = userRepository.findById(request.id)
            ?: throw IllegalArgumentException("User not found with id: ${request.id}")

        val updatedUser = existingUser.copy(
            name = request.name,
            email = request.email,
            phoneNumber = request.phoneNumber,
            Street = request.street,
            StreetNumber = request.streetNumber,
            description = request.description,
            City = request.city,
            ZipCode = request.zipCode,
        )

        val user =  userRepository.save(updatedUser)
        return UserProfileResponse(
            user.id,
            user.name,
            user.email,
            user.phoneNumber,
            user.Street,
            user.StreetNumber,
            user.description,
            user.City,
            user.ZipCode
        )
    }


}