package com.nom.api.domain.menu.ports.`in`

import com.nom.api.domain.menu.entities.RestaurantProfile
import com.nom.api.domain.user.entities.User

interface GetAllRestaurantUseCase {
    suspend fun execute(): List<User>
}