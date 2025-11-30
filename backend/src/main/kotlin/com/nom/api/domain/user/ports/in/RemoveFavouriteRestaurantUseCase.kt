package com.nom.api.domain.user.ports.`in`

interface RemoveFavouriteRestaurantUseCase {
    fun removeRestaurant(userId: String, restaurantId: String)
}