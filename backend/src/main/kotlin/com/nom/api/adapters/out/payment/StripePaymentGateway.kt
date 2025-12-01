package com.nom.api.adapters.out.payment

import com.nom.api.domain.order.entities.PaymentMethod
import com.nom.api.domain.payment.ports.out.PaymentGateway
import com.stripe.Stripe
import com.stripe.model.PaymentIntent
import com.stripe.param.PaymentIntentCreateParams
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.math.BigDecimal
import jakarta.annotation.PostConstruct

@Component
class StripePaymentGateway(
    @Value("\${stripe.api.key}") private val apiKey: String
) : PaymentGateway {

    @PostConstruct
    fun init() {
        Stripe.apiKey = apiKey
    }

    override fun processPayment(amount: Long, method: PaymentMethod): Boolean {
        if (method != PaymentMethod.CREDIT_CARD) {
            return true
        }

        return try {
            val amountInCents = amount * 100

            val params = PaymentIntentCreateParams.builder()
                .setAmount(amountInCents)
                .setCurrency("huf")
                .addPaymentMethodType("card")
                .setDescription("Nom ételrendelés")
                .build()

            val paymentIntent = PaymentIntent.create(params)

            println("Stripe fizetés előkészítve: ${paymentIntent.id}, státusz: ${paymentIntent.status}")
            true

        } catch (e: Exception) {
            println("Stripe hiba történt: ${e.message}")
            false
        }
    }
}