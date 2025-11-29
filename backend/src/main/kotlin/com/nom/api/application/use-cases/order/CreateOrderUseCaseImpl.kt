package com.nom.api.application.usecases.order

import com.nom.api.domain.menu.ports.out.MenuRepository
import com.nom.api.domain.order.entities.Order
import com.nom.api.domain.order.entities.OrderItem
import com.nom.api.domain.order.entities.OrderStatus
import com.nom.api.domain.order.entities.PaymentMethod // <-- Fontos
import com.nom.api.domain.order.ports.`in`.CreateOrderCommand
import com.nom.api.domain.order.ports.`in`.CreateOrderUseCase
import com.nom.api.domain.order.ports.out.OrderRepository
import com.nom.api.domain.payment.ports.out.PaymentGateway // <-- Fontos: Az új port
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import java.math.BigDecimal

@Service
class CreateOrderUseCaseImpl(
    private val orderRepository: OrderRepository,
    private val menuRepository: MenuRepository,
    private val paymentGateway: PaymentGateway // <-- INJEKTÁLJUK BE!
) : CreateOrderUseCase {

    @Transactional
    override fun createOrder(command: CreateOrderCommand): String {
        // 1. Menü lekérése
        val restaurantMenu = menuRepository.findByRestaurantId(command.restaurantId)
            ?: throw IllegalArgumentException("Étterem nem található")

        // 2. OrderItem-ek összeállítása és ár számolása
        var calculatedTotalPrice: Long = 0
        val finalOrderItems = command.items.map { itemCmd ->
            val menuItem = restaurantMenu.menuItems.find { it.id == itemCmd.menuItemId }
                ?: throw IllegalArgumentException("A termék nem található: ${itemCmd.menuItemId}")

            calculatedTotalPrice += menuItem.price * itemCmd.quantity

            OrderItem(
                menuItemId = menuItem.id,
                name = menuItem.name,
                price = menuItem.price,
                quantity = itemCmd.quantity
            )
        }

        // --- ÚJ RÉSZ: FIZETÉS INTEGRÁCIÓ ---
        // Megpróbáljuk a fizetést. Ha CREDIT_CARD és a Stripe hibát dob, akkor kivételt dobunk,
        // így a tranzakció visszagördül, és nem jön létre a rendelés.
        val paymentSuccessful = paymentGateway.processPayment(calculatedTotalPrice, command.paymentMethod)

        if (!paymentSuccessful) {
            throw IllegalStateException("A bankkártyás fizetés sikertelen volt. Kérjük, ellenőrizze az adatokat vagy próbálja újra.")
        }
        // -----------------------------------

        // 3. Rendelés entitás összeállítása
        val newOrder = Order(
            customerId = command.customerId,
            restaurantId = command.restaurantId,
            items = finalOrderItems,
            deliveryAddress = command.deliveryAddress,
            totalPrice = calculatedTotalPrice,
            paymentMethod = command.paymentMethod,
            status = OrderStatus.NEW,
            createdAt = LocalDateTime.now()
        )

        // 4. Mentés
        val savedOrder = orderRepository.save(newOrder)
        return savedOrder.id ?: throw IllegalStateException("Sikertelen mentés")
    }
}