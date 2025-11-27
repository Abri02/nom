package com.nom.api.domain.order.entities

import java.math.BigDecimal

data class OrderItem(
    val menuItemId: String,
    val name: String,
    val price: BigDecimal,
    val quantity: Int
)