package com.nom.api.domain.menu.ports.`in`

import com.nom.api.domain.menu.entities.RestaurantProfile

interface UpdateRestaurantProfileUseCase {
    suspend fun execute(request: UpdateRestaurantProfileRequest): RestaurantProfile
}

data class UpdateRestaurantProfileRequest(
    val restaurantId: String,
    val restaurantName: String,
    val openingHours: String
)