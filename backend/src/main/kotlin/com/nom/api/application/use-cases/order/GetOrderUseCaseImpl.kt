package com.nom.api.application.usecases.order

import com.nom.api.domain.order.entities.Order
import com.nom.api.domain.order.entities.OrderStatus
import com.nom.api.domain.order.ports.`in`.GetOrdersUseCase
import com.nom.api.domain.order.ports.out.OrderRepository
import org.springframework.stereotype.Service

@Service
class GetOrdersUseCaseImpl(
    private val orderRepository: OrderRepository
) : GetOrdersUseCase {

    override fun getOrders(userId: String, role: String, status: OrderStatus?): List<Order> {
        return when (role) {
            "RESTAURANT" -> {
                if (status != null) {
                    orderRepository.findAllByRestaurantIdAndStatus(userId, status)
                } else {
                    orderRepository.findAllByRestaurantId(userId)
                }
            }
            "CUSTOMER" -> {
                orderRepository.findAllByCustomerId(userId)
            }
            "COURIER" -> {
                if (status == OrderStatus.READY) {
                    orderRepository.findAllByStatus(OrderStatus.READY)
                } else {
                    orderRepository.findAllByCourierId(userId)
                }
            }
            else -> emptyList()
        }
    }
}