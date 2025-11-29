package com.nom.api.domain.order.ports.`in`

interface PrepareOrderByRestaurantUseCase {
    fun  prepareOrder(orderId: String, restaurantId: String) :  OrderDetail?
}