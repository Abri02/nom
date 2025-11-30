package com.nom.api.application.`use-cases`.menu

import com.nom.api.domain.menu.ports.`in`.DeleteMenuItemUseCase
import com.nom.api.domain.menu.ports.out.MenuRepository
import com.nom.api.domain.ports.out.UserRepository
import com.nom.api.domain.user.entities.UserRole
import org.springframework.stereotype.Service

@Service
class DeleteMenuItemUseCaseImpl(
    private val menuRepository: MenuRepository,
    private val userRepository: UserRepository,
) : DeleteMenuItemUseCase {

    override suspend fun execute(restaurantId: String, menuItemId: String): Boolean {
        val user = userRepository.findById(restaurantId)
            ?: throw IllegalArgumentException("User not found with id: $restaurantId")

        if (user.role != UserRole.ADMIN && user.role != UserRole.RESTAURANT) {
            throw IllegalStateException("Only ADMIN or RESTAURANT users can remove menu items")
        }

        return menuRepository.deleteMenuItem(restaurantId, menuItemId)
    }
}