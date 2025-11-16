package com.nom.api.application.`use-cases`.menu

import com.nom.api.domain.menu.entities.RestaurantProfile
import com.nom.api.domain.menu.ports.`in`.GetRestaurantProfileUseCase
import com.nom.api.domain.menu.ports.out.MenuRepository
import org.springframework.stereotype.Service

@Service
class GetRestaurantProfileUseCaseImpl(
    private val menuRepository: MenuRepository
) : GetRestaurantProfileUseCase {

    override suspend fun execute(restaurantId: String): RestaurantProfile? {
        return menuRepository.getRestaurantProfile(restaurantId)
    }
}