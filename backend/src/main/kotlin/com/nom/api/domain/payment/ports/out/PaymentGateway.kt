package com.nom.api.domain.payment.ports.out

import com.nom.api.domain.order.entities.PaymentMethod
import java.math.BigDecimal

interface PaymentGateway {
    // Visszatérési érték: true ha sikeres, false ha nem
    fun processPayment(amount: BigDecimal, method: PaymentMethod): Boolean
}