package com.nom.api.application.`use-cases`.menu

import com.nom.api.domain.menu.ports.`in`.DeleteMenuItemUseCase
import com.nom.api.domain.menu.ports.out.MenuRepository
import org.springframework.stereotype.Service

@Service
class DeleteMenuItemUseCaseImpl(
    private val menuRepository: MenuRepository
) : DeleteMenuItemUseCase {

    override suspend fun execute(restaurantId: String, menuItemId: String): Boolean {
        return menuRepository.deleteMenuItem(restaurantId, menuItemId)
    }
}