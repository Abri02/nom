package com.nom.api.domain.order.ports.`in`

interface GetAllOrderUseCase {
    fun getAllOrder(userId: String): List<OrderDetail>
}