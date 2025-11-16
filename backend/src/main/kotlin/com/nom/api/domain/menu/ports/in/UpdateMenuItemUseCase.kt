package com.nom.api.domain.menu.ports.`in`

import com.nom.api.domain.menu.entities.MenuItem
import java.math.BigDecimal

interface UpdateMenuItemUseCase {
    suspend fun execute(request: UpdateMenuItemRequest): MenuItem
}

data class UpdateMenuItemRequest(
    val restaurantId: String,
    val menuItemId: String,
    val name: String,
    val description: String? = null,
    val price: BigDecimal,
    val allergens: List<String> = emptyList(),
    val imageUrl: String? = null
)