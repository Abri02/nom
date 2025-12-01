package com.nom.api.domain.payment.ports.out

import com.nom.api.domain.order.entities.PaymentMethod

interface PaymentGateway {
    fun processPayment(amount: Long, method: PaymentMethod): Boolean
}