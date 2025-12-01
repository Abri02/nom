package com.nom.api.domain.restaurant.ports.`in`

import com.nom.api.domain.user.entities.User

interface GetRestaurantsUseCase {
    suspend fun getRestaurants(cuisineType: String?): List<User>
}