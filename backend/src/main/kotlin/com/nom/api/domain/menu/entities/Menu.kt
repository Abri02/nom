package com.nom.api.domain.menu.entities

import java.math.BigDecimal

data class Menu(
    val menuItems: List<MenuItem> = listOf(),
)

data class MenuItem(
    val id: String,                    // Mongo ObjectId hex stringje pl. "6520e4..."
    val name: String,
    val description: String? = null,
    val price: BigDecimal,             // vagy Double, ha egyszerűbben szeretnétek
    val allergens: List<String> = emptyList(),
    val imageUrl: String? = null
){
    init{
        require(name.isNotBlank()) { "Menu item name cannot be blank" }
        require(price >= BigDecimal.ZERO) { "Price must be non-negative" }
    }
}