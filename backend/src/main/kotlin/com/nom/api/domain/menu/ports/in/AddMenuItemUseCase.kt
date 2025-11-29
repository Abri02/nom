package com.nom.api.domain.menu.ports.`in`

import com.nom.api.domain.menu.entities.MenuItem

interface AddMenuItemUseCase {
    suspend fun execute(request: AddMenuItemRequest): MenuItem
}

data class AddMenuItemRequest(
    val restaurantId: String,
    val name: String,
    val description: String? = null,
    val price: Long,
    val allergens: List<String> = emptyList(),
    val imageUrl: String? = null
)