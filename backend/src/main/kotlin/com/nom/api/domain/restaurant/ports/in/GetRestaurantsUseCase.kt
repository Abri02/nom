package com.nom.api.domain.restaurant.ports.`in`

import com.nom.api.domain.user.entities.User // Vagy külön Restaurant entitás, ha van
// A User entitás tartalmazza az étterem adatait is a "RESTAURANT" role esetén

interface GetRestaurantsUseCase {
    suspend fun getRestaurants(cuisineType: String?): List<User>
}