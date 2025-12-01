package com.nom.api.domain.order.ports.`in`

data class OrderItemDetail(
    val restaurantId: String,
    val menuItemId: String,
    val menuItemName: String,
    val quantity: Int,
    val price: Long
)
