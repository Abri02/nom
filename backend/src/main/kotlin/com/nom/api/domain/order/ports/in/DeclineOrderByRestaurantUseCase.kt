package com.nom.api.domain.order.ports.`in`

interface DeclineOrderByRestaurantUseCase {
    fun declineOrder(orderId: String, restaurantId: String) :  OrderDetail?
}