package com.nom.api.application.`use-cases`.order

import com.nom.api.domain.menu.ports.out.MenuRepository
import com.nom.api.domain.order.entities.OrderStatus
import com.nom.api.domain.order.ports.`in`.AcceptOrderByRestaurantUseCase
import com.nom.api.domain.order.ports.`in`.GetOrderByIdUseCase
import com.nom.api.domain.order.ports.`in`.OrderDetail
import com.nom.api.domain.order.ports.out.OrderRepository
import org.springframework.stereotype.Service

@Service
class AcceptOrderByRestaurantUseCaseImpl(
    private val menuRepository: MenuRepository,
    private val orderRepository: OrderRepository,
    private val getOrderByIdUseCase: GetOrderByIdUseCase
): AcceptOrderByRestaurantUseCase {
    override fun acceptOrder(orderId: String, restaurantId: String): OrderDetail? {
        val order = orderRepository.findById(orderId) ?: return null

        if (order.restaurantId != restaurantId) {
            throw IllegalStateException(
                "Order $orderId does not belong to restaurant $restaurantId"
            )
        }

        if (order.status != OrderStatus.NEW) {
            throw IllegalStateException(
                "Only NEW orders can be accepted. Current status: ${order.status}"
            )
        }

        order.changeStatus(OrderStatus.PREPARING)

        orderRepository.save(order)

        return getOrderByIdUseCase.getOrderById(orderId)
    }
}