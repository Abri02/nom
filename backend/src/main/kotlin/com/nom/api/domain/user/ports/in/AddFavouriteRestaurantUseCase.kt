package com.nom.api.domain.user.ports.`in`

interface AddFavouriteRestaurantUseCase {
    fun addFavourite(restaurantId: String, userId: String)
}