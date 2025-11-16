package com.nom.api.domain.menu.ports.`in`

import com.nom.api.domain.menu.entities.RestaurantProfile

interface GetRestaurantProfileUseCase {
    suspend fun execute(restaurantId: String): RestaurantProfile?
}