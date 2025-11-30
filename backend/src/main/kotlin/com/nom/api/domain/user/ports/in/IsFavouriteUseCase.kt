package com.nom.api.domain.user.ports.`in`

interface IsFavouriteUseCase {
    fun isFavourite(restaurantId: String, userId: String): Boolean
}