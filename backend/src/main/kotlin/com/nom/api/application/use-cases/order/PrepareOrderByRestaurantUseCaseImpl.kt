package com.nom.api.application.`use-cases`.order

import com.nom.api.domain.order.ports.`in`.OrderDetail
import com.nom.api.domain.order.ports.`in`.PrepareOrderByRestaurantUseCase
import com.nom.api.domain.order.ports.out.OrderRepository
import com.nom.api.domain.order.entities.OrderStatus
import com.nom.api.domain.order.ports.`in`.GetOrderByIdUseCase
import com.nom.api.domain.ports.out.UserRepository
import org.springframework.stereotype.Service

@Service
class PrepareOrderByRestaurantUseCaseImpl(
    private val orderRepository: OrderRepository,
    private val getOrderByIdUseCase: GetOrderByIdUseCase,
    private val userRepository: UserRepository
): PrepareOrderByRestaurantUseCase {
    override fun prepareOrder(orderId: String, restaurantId: String): OrderDetail? {
        val order = orderRepository.findById(orderId) ?: return null

        if (order.restaurantId != restaurantId) {
            throw IllegalStateException(
                "Order $orderId does not belong to restaurant $restaurantId"
            )
        }

        if (order.status != OrderStatus.PREPARING) {
            throw IllegalStateException(
                "Only PREPARING orders can be done making. Current status: ${order.status}"
            )
        }

        val courier = userRepository.getRandomCourier()

        if (courier == null) {
            order.changeStatus(OrderStatus.CANCELLED)
            order.courierId = null
        } else {
            order.courierId = courier.id
            order.changeStatus(OrderStatus.READY)
        }

        orderRepository.save(order)

        return getOrderByIdUseCase.getOrderById(orderId)
    }
}