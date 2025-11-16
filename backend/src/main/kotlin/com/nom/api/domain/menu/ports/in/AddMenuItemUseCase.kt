package com.nom.api.domain.menu.ports.`in`

import com.nom.api.domain.menu.entities.MenuItem
import java.math.BigDecimal

interface AddMenuItemUseCase {
    suspend fun execute(request: AddMenuItemRequest): MenuItem
}

data class AddMenuItemRequest(
    val restaurantId: String,
    val name: String,
    val description: String? = null,
    val price: BigDecimal,
    val allergens: List<String> = emptyList(),
    val imageUrl: String? = null
)