package com.nom.api.application.`use-cases`.menu

import com.nom.api.domain.menu.entities.MenuItem
import com.nom.api.domain.menu.ports.`in`.UpdateMenuItemRequest
import com.nom.api.domain.menu.ports.`in`.UpdateMenuItemUseCase
import com.nom.api.domain.menu.ports.out.MenuRepository
import com.nom.api.domain.ports.out.UserRepository
import com.nom.api.domain.user.entities.UserRole
import org.springframework.stereotype.Service

@Service
class UpdateMenuItemUseCaseImpl(
    private val menuRepository: MenuRepository,
    private val userRepository: UserRepository,
) : UpdateMenuItemUseCase {

    override suspend fun execute(request: UpdateMenuItemRequest): MenuItem {
        val user = userRepository.findById(request.restaurantId)
            ?: throw IllegalArgumentException("User not found with id: $request.restaurantId")

        if (user.role != UserRole.ADMIN && user.role != UserRole.RESTAURANT) {
            throw IllegalStateException("Only ADMIN or RESTAURANT users can remove menu items")
        }

        val item = MenuItem(
            id = request.menuItemId,
            name = request.name,
            description = request.description,
            price = request.price,
            allergens = request.allergens,
            imageUrl = request.imageUrl
        )

        return menuRepository.updateMenuItem(request.restaurantId, item)
    }
}