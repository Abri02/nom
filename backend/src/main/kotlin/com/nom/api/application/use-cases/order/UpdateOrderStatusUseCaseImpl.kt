package com.nom.api.application.usecases.order

import com.nom.api.domain.order.entities.OrderStatus
import com.nom.api.domain.order.ports.`in`.UpdateOrderStatusUseCase
import com.nom.api.domain.order.ports.out.OrderRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class UpdateOrderStatusUseCaseImpl(
    private val orderRepository: OrderRepository
) : UpdateOrderStatusUseCase {

    @Transactional
    override fun updateStatus(orderId: String, newStatus: OrderStatus, userId: String, userRole: String) {
        val order = orderRepository.findById(orderId)
            ?: throw IllegalArgumentException("Order with id $orderId not found")

        when (userRole) {
            "RESTAURANT" -> {
                if (order.restaurantId != userId) {
                    throw IllegalAccessException("User with id $userId is not authorized to update this order")
                }
            }
            "COURIER" -> {
                // JAVÍTÁS: Megnézzük, épp most veszi-e fel a rendelést
                val isTakingOrder = order.status == OrderStatus.READY && newStatus == OrderStatus.ON_DELIVERY

                // Ha NEM most veszi fel, és NEM az ő neve van rajta, akkor hiba
                if (!isTakingOrder && order.courierId != userId) {
                    throw IllegalAccessException("User with id $userId is not authorized to update this order")
                }
            }
            "CUSTOMER" -> {
                throw IllegalAccessException("Customers are not authorized to update order status")
            }
            else -> {
                throw IllegalArgumentException("Invalid user role: $userRole")
            }
        }

        // Státuszváltás
        order.changeStatus(newStatus)

        // Ha futár most vette fel, mentsük el az ID-ját
        if (newStatus == OrderStatus.ON_DELIVERY && userRole == "COURIER") {
            order.courierId = userId
        }

        orderRepository.save(order)
    }
}