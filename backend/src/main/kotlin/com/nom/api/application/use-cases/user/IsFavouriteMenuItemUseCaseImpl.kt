package com.nom.api.application.`use-cases`.user

import com.nom.api.domain.ports.out.UserRepository
import com.nom.api.domain.user.ports.`in`.IsFavouoriteMenuItemUseCase
import org.springframework.stereotype.Service

@Service
class IsFavouriteMenuItemUseCaseImpl(
    var userRepository: UserRepository
) : IsFavouoriteMenuItemUseCase{
    override fun isFavourite(restaurantId: String, menuItemId: String, userId: String): Boolean {
        val user = userRepository.findById(userId)
            ?: throw IllegalArgumentException("User not found with id: $userId")

        return user.favouriteMenuItems.any {
            it.menuItemId == menuItemId && it.restaurantId == restaurantId
        }
    }
}