package com.nom.api.application.`use-cases`.user

import com.nom.api.domain.ports.out.UserRepository
import com.nom.api.domain.user.ports.`in`.RemoveFavouriteRestaurantUseCase
import org.springframework.stereotype.Service

@Service
class RemoveFavouriteRestaurantUseCaseImpl(
    private val userRepository: UserRepository,
) : RemoveFavouriteRestaurantUseCase {
    override fun removeRestaurant(userId: String, restaurantId: String) {
        val user = userRepository.findById(userId)
            ?: throw IllegalArgumentException("User not found with id: $userId")

        if (!user.favouriteRestaurants.contains(restaurantId)) {
            return
        }

        user.favouriteRestaurants.remove(restaurantId)

        userRepository.save(user)
    }
}