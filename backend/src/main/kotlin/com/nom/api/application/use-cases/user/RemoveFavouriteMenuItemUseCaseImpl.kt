package com.nom.api.application.`use-cases`.user

import com.nom.api.domain.ports.out.UserRepository
import com.nom.api.domain.user.entities.FavouriteMenuItem
import com.nom.api.domain.user.ports.`in`.RemoveFavouriteMenuItemUseCase
import org.springframework.stereotype.Service

@Service
class RemoveFavouriteMenuItemUseCaseImpl(
    private val userRepository: UserRepository,
): RemoveFavouriteMenuItemUseCase {
    override fun removeFavouriteMenuItem(restaurantId: String, menuItemId: String, userId: String) {
        val user = userRepository.findById(userId)
            ?: throw IllegalArgumentException("User not found with id: $userId")

        user.favouriteMenuItems.removeIf {
            it.menuItemId == menuItemId && it.restaurantId == restaurantId
        }

        userRepository.save(user)
    }
}