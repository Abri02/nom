package com.nom.api.application.`use-cases`.menu

import com.nom.api.domain.menu.entities.MenuItem
import com.nom.api.domain.menu.ports.`in`.UpdateMenuItemRequest
import com.nom.api.domain.menu.ports.`in`.UpdateMenuItemUseCase
import com.nom.api.domain.menu.ports.out.MenuRepository
import org.springframework.stereotype.Service

@Service
class UpdateMenuItemUseCaseImpl(
    private val menuRepository: MenuRepository
) : UpdateMenuItemUseCase {

    override suspend fun execute(request: UpdateMenuItemRequest): MenuItem {
        // opcionálisan ellenőrizheted, hogy az étterem létezik-e, de
        // a MongoMenuRepository úgyis dob, ha nincs ilyen item
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