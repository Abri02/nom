package com.nom.api.domain.order.ports.`in`

import com.nom.api.domain.order.entities.OrderStatus

interface UpdateOrderStatusUseCase {
    fun updateStatus(orderId: String, newStatus: OrderStatus, userId: String, userRole: String)
}