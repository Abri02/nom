package com.nom.api.application.`use-cases`.user

import com.nom.api.domain.ports.out.UserRepository
import com.nom.api.domain.user.entities.User
import com.nom.api.domain.user.ports.`in`.GetProfileByUserIdUseCase
import com.nom.api.domain.user.ports.`in`.ProfileResponse
import org.springframework.stereotype.Service

@Service
class GetProfileByUserIdUseCaseImpl (
    private val userRepository: UserRepository
): GetProfileByUserIdUseCase {

    override fun getProfileByUserId(userId: String): ProfileResponse? {
        val user = userRepository.findById(userId)
            ?: throw IllegalArgumentException("Felhasználó nem található")
        return ProfileResponse(
            user.id,
            user.name,
            user.email,
            user.phoneNumber,
            user.Street,
            user.StreetNumber,
            user.City,
            user.ZipCode,
            user.role,
            user.description,
            user.isSuspended,
            user.favouriteRestaurants,
            user.createdAt.toString()

        )
    }
}