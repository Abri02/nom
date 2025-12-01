package com.nom.api.domain.user.ports.`in`

interface RemoveFavouriteMenuItemUseCase {
    fun removeFavouriteMenuItem(restaurantId: String, menuItemId: String, userId: String)
}