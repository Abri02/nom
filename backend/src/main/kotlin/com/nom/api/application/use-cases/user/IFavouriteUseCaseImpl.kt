package com.nom.api.application.`use-cases`.user

import com.nom.api.domain.ports.out.UserRepository
import com.nom.api.domain.user.ports.`in`.IsFavouriteUseCase
import org.springframework.stereotype.Service

@Service
class IFavouriteUseCaseImpl(
    private val userRepository: UserRepository,
) : IsFavouriteUseCase {
    override fun isFavourite(restaurantId: String, userId: String): Boolean {
        val user = userRepository.findById(userId)
            ?: throw IllegalArgumentException("User not found with id: $userId")

        return user.favouriteRestaurants.contains(restaurantId)
    }
}