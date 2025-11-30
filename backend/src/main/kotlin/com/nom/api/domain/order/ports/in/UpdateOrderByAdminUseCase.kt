package com.nom.api.domain.order.ports.`in`

interface UpdateOrderByAdminUseCase {
    fun updateOrder(order: OrderDetail, userId: String): OrderDetail
}