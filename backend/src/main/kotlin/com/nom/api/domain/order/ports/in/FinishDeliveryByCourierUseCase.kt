package com.nom.api.domain.order.ports.`in`

interface FinishDeliveryByCourierUseCase {
    fun finishDelivery(orderId: String, courierId: String): OrderDetail?
}