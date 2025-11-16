package com.nom.api.application.`use-cases`.menu

import com.nom.api.domain.menu.entities.Menu
import com.nom.api.domain.menu.entities.RestaurantProfile
import com.nom.api.domain.menu.ports.`in`.UpdateRestaurantProfileRequest
import com.nom.api.domain.menu.ports.`in`.UpdateRestaurantProfileUseCase
import com.nom.api.domain.menu.ports.out.MenuRepository
import org.springframework.stereotype.Service

@Service
class UpdateRestaurantProfileUseCaseImpl(
    private val menuRepository: MenuRepository
) : UpdateRestaurantProfileUseCase {

    override suspend fun execute(request: UpdateRestaurantProfileRequest): RestaurantProfile {
        val existingProfile = menuRepository.getRestaurantProfile(request.restaurantId)

        val profile = if (existingProfile != null) {
            existingProfile.copy(
                restaurantName = request.restaurantName,
                openingHours = request.openingHours
            )
        } else {
            throw IllegalArgumentException("Restaurant with id ${request.restaurantId} not found")
        }

        return menuRepository.updateRestaurantProfile(request.restaurantId, profile)
    }
}