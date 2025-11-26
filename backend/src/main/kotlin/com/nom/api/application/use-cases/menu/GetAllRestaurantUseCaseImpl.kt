package com.nom.api.application.`use-cases`.menu

import com.nom.api.domain.menu.entities.RestaurantProfile
import com.nom.api.domain.menu.ports.`in`.GetAllRestaurantUseCase
import com.nom.api.domain.menu.ports.out.MenuRepository
import org.springframework.stereotype.Service

@Service
class GetAllRestaurantUseCaseImpl(
    private val menuRepository: MenuRepository
) : GetAllRestaurantUseCase {

    override suspend fun execute(): List<RestaurantProfile> {
        return menuRepository.findAllRestaurants()
    }

}