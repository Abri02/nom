package com.nom.api.domain.order.ports.`in`

interface GetOrderByCourierIdUseCase {
    fun getOrder(courierId: String): List<OrderDetail>
}