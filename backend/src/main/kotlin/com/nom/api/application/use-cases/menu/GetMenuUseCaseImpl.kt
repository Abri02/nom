package com.nom.api.application.`use-cases`.menu

import com.nom.api.domain.menu.entities.Menu
import com.nom.api.domain.menu.ports.`in`.GetMenuUseCase
import com.nom.api.domain.menu.ports.out.MenuRepository
import org.springframework.stereotype.Service

@Service
class GetMenuUseCaseImpl(
    private val menuRepository: MenuRepository
) : GetMenuUseCase {

    override suspend fun execute(restaurantId: String): Menu? {
        return menuRepository.getMenu(restaurantId)
    }
}