package com.nom.api.domain.payment.ports.out

import com.nom.api.domain.order.entities.PaymentMethod

interface PaymentGateway {
    // Visszatérési érték: true ha sikeres, false ha nem
    fun processPayment(amount: Long, method: PaymentMethod): Boolean
}