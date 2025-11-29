package com.nom.api.domain.order.entities


data class OrderItem(
    val menuItemId: String,
    val name: String,
    val price: Long,
    val quantity: Int
)