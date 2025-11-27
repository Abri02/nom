package com.nom.api.domain.cart.entities

import java.math.BigDecimal

data class CartItem(
    val menuItemId: String,
    val name: String,
    val price: BigDecimal,
    var quantity: Int
)