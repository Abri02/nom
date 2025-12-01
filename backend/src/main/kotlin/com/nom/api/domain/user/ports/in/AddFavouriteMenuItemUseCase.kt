package com.nom.api.domain.user.ports.`in`

interface AddFavouriteMenuItemUseCase {
    fun addFavouriteMenuItem(restaurantId: String, menuItemId: String, userId: String)
}