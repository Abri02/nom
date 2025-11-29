package com.nom.api.application.`use-cases`.order

import com.nom.api.domain.order.entities.OrderStatus
import com.nom.api.domain.order.ports.`in`.DeclineOrderByRestaurantUseCase
import com.nom.api.domain.order.ports.`in`.GetOrderByIdUseCase
import com.nom.api.domain.order.ports.`in`.OrderDetail
import com.nom.api.domain.order.ports.out.OrderRepository
import org.springframework.stereotype.Service

@Service
class DeclineOrderByRestaurantUseCaseImpl(
    private val orderRepository: OrderRepository,
    private val getOrderByIdUseCase: GetOrderByIdUseCase,
): DeclineOrderByRestaurantUseCase {
    override fun declineOrder(orderId: String, restaurantId: String): OrderDetail? {
        val order = orderRepository.findById(orderId) ?: return null

        if (order.restaurantId != restaurantId) {
            throw IllegalStateException(
                "Order $orderId does not belong to restaurant $restaurantId"
            )
        }

        if (order.status != OrderStatus.NEW) {
            throw IllegalStateException(
                "Only NEW orders can be declined. Current status: ${order.status}"
            )
        }

        order.changeStatus(OrderStatus.CANCELLED)

        orderRepository.save(order)

        return getOrderByIdUseCase.getOrderById(orderId)
    }
}