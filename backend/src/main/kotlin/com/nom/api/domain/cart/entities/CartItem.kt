package com.nom.api.domain.cart.entities

import java.math.BigDecimal

data class CartItem(
    val restaurantId: String,
    val menuItemId: String,
    var quantity: Int
)