package com.nom.api.domain.menu.entities

data class MenuItem(
    val id: String,
    val name: String,
    val description: String? = null,
    val price: Long,
    val allergens: List<String> = emptyList(),
    val imageUrl: String? = null
){
    init{
        require(name.isNotBlank()) { "Menu item name cannot be blank" }
        require(price >= 0) { "Price must be non-negative" }
    }
}