package com.nom.api.application.`use-cases`.menu

import com.nom.api.domain.menu.entities.MenuItem
import com.nom.api.domain.menu.ports.`in`.AddMenuItemRequest
import com.nom.api.domain.menu.ports.`in`.AddMenuItemUseCase
import com.nom.api.domain.menu.ports.out.MenuRepository
import org.springframework.stereotype.Service
import java.util.*

@Service
class AddMenuItemUseCaseImpl(
    private val menuRepository: MenuRepository
) : AddMenuItemUseCase {

    override suspend fun execute(request: AddMenuItemRequest): MenuItem {
        if (menuRepository.getRestaurantProfile(request.restaurantId) == null) {
            throw IllegalArgumentException(
                "Restaurant with id ${request.restaurantId} not found"
            )
        }

        val menuItem = MenuItem(
            id = UUID.randomUUID().toString(),
            name = request.name,
            description = request.description,
            price = request.price,
            allergens = request.allergens,
            imageUrl = request.imageUrl
        )

        return menuRepository.addMenuItem(request.restaurantId, menuItem)
    }
}