package com.nom.api.domain.order.ports.`in`

interface CreateOrderUseCase {
     fun createOrder(userId: String): OrderDetail
}