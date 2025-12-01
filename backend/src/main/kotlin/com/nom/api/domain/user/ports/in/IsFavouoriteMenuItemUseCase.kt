package com.nom.api.domain.user.ports.`in`

interface IsFavouoriteMenuItemUseCase {
    fun isFavourite(restaurantId: String, menuItemId: String, userId: String): Boolean
}