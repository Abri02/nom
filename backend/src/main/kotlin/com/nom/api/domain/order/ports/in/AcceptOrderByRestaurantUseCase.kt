package com.nom.api.domain.order.ports.`in`

interface AcceptOrderByRestaurantUseCase {
    fun acceptOrder(orderId: String, restaurantId: String) : OrderDetail?
}