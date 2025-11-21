package com.nom.api.domain.order.ports.`in`

import com.nom.api.domain.order.entities.Order
import com.nom.api.domain.order.entities.OrderStatus

interface GetOrdersUseCase {
     fun getOrders(userId: String, role: String, status: OrderStatus?): List<Order>
}