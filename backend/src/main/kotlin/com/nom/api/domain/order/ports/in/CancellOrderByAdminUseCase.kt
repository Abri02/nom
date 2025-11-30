package com.nom.api.domain.order.ports.`in`

interface CancellOrderByAdminUseCase {
    fun  cancelOrderByAdmin(orderId: String, userId: String)
}