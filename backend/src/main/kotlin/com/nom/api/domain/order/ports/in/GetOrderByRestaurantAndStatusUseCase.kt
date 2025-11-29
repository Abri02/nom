package com.nom.api.domain.order.ports.`in`

import com.nom.api.domain.order.entities.OrderStatus

interface GetOrderByRestaurantAndStatusUseCase {
    fun getOrder(restaurantId: String, status: OrderStatus): List<OrderDetail>
}