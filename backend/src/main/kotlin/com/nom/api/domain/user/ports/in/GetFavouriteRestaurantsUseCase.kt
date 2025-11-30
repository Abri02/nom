package com.nom.api.domain.user.ports.`in`

import com.nom.api.domain.menu.entities.RestaurantProfile

interface GetFavouriteRestaurantsUseCase {
    fun getFavourites(userId: String): List<RestaurantProfile>
}