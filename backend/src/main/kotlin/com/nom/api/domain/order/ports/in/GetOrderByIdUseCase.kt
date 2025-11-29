package com.nom.api.domain.order.ports.`in`

interface GetOrderByIdUseCase {
    fun  getOrderById(orderId: String): OrderDetail?
}