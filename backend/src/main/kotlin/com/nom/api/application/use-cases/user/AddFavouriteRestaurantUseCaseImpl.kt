package com.nom.api.application.`use-cases`.user

import com.nom.api.domain.ports.out.UserRepository
import com.nom.api.domain.user.ports.`in`.AddFavouriteRestaurantUseCase
import org.springframework.stereotype.Service

@Service
class AddFavouriteRestaurantUseCaseImpl(
    private val userRepository: UserRepository,
): AddFavouriteRestaurantUseCase {
    override fun addFavourite(restaurantId: String, userId: String) {
        val user = userRepository.findById(userId)
            ?: throw IllegalArgumentException("User not found with id: $userId")

        if (user.favouriteRestaurants.contains(restaurantId)) {
            return
        }

        user.favouriteRestaurants.add(restaurantId)

        userRepository.save(user)
    }
}