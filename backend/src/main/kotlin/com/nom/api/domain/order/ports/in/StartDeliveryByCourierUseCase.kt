package com.nom.api.domain.order.ports.`in`

interface StartDeliveryByCourierUseCase {
    fun startDelivery(orderId: String, courierId: String) :  OrderDetail?
}