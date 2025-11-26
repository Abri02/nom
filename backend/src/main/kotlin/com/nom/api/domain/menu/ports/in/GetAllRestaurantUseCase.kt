package com.nom.api.domain.menu.ports.`in`

import com.nom.api.domain.menu.entities.RestaurantProfile

interface GetAllRestaurantUseCase {
    suspend fun execute(): List<RestaurantProfile>
}