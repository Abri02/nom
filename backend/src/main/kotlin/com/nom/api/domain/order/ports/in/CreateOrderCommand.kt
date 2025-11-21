package com.nom.api.domain.order.ports.`in`

import com.nom.api.domain.order.entities.Address
import com.nom.api.domain.order.entities.PaymentMethod

data class CreateOrderCommand(
    val customerId: String,
    val restaurantId: String,
    val items: List<OrderItemCommand>,
    val deliveryAddress: Address,
    val paymentMethod: PaymentMethod
)

data class OrderItemCommand(
    val menuItemId: String,
    val quantity: Int
)