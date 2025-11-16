package com.nom.api.domain.menu.entities

data class RestaurantProfile (
    val restaurantName: String,
    val openingHours: String? = null,
    val menu: Menu = Menu()
){
    init{
        require(restaurantName.isNotBlank()) { "Restaurant name cannot be blank" }
    }
}