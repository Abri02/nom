package com.nom.api.domain.menu.ports.`in`

interface DeleteMenuItemUseCase {
    suspend fun execute(restaurantId: String, menuItemId: String): Boolean
}