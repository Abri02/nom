package com.nom.api.application.`use-cases`.user

import com.nom.api.domain.ports.out.UserRepository
import com.nom.api.domain.user.entities.FavouriteMenuItem
import com.nom.api.domain.user.ports.`in`.AddFavouriteMenuItemUseCase
import org.springframework.stereotype.Service

@Service
class AddFavouriteMenuItemUseCaseImpl(
    private val userRepository: UserRepository
) : AddFavouriteMenuItemUseCase {
    override fun addFavouriteMenuItem(restaurantId: String, menuItemId: String, userId: String) {
        val user = userRepository.findById(userId)
            ?: throw IllegalArgumentException("User not found with id: $userId")

        if (user.favouriteMenuItems.any {
                it.menuItemId == menuItemId && it.restaurantId == restaurantId
            }
        ) {
            return
        }

        val newFavouriteMenuItem = FavouriteMenuItem(menuItemId, restaurantId)

        user.favouriteMenuItems.add(newFavouriteMenuItem)

        userRepository.save(user)
    }
}