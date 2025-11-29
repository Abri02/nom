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
    // Itt olvassuk ki a kulcsot a properties fájlból
    @Value("\${stripe.api.key}") private val apiKey: String
) : PaymentGateway {

    @PostConstruct
    fun init() {
        // Alkalmazás indulásakor beállítjuk a Stripe kulcsot
        Stripe.apiKey = apiKey
    }

    override fun processPayment(amount: Long, method: PaymentMethod): Boolean {
        // 1. Ha nem bankkártya, akkor nem kell Stripe (pl. Utánvét mindig sikeres)
        if (method != PaymentMethod.CREDIT_CARD) {
            return true
        }

        return try {
            // 2. Összeg átváltása a legkisebb pénznemre (HUF esetén fillér/egész, de a Stripe 100-as szorzót vár általában)
            val amountInCents = amount * 100

            // 3. Fizetési szándék (Intent) létrehozása
            val params = PaymentIntentCreateParams.builder()
                .setAmount(amountInCents)
                .setCurrency("huf")
                .addPaymentMethodType("card")
                .setDescription("Nom ételrendelés")
                .build()

            val paymentIntent = PaymentIntent.create(params)

            // Ha idáig eljutottunk hiba nélkül, a fizetési igény létrejött a Stripe-nál
            println("Stripe fizetés előkészítve: ${paymentIntent.id}, státusz: ${paymentIntent.status}")
            true

        } catch (e: Exception) {
            // Hiba esetén (pl. rossz API kulcs, hálózati hiba)
            println("Stripe hiba történt: ${e.message}")
            false
        }
    }
}