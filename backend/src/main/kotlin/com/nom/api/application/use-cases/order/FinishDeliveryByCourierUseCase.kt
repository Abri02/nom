package com.nom.api.application.`use-cases`.order

import com.nom.api.domain.order.entities.OrderStatus
import com.nom.api.domain.order.ports.`in`.FinishDeliveryByCourierUseCase
import com.nom.api.domain.order.ports.`in`.GetOrderByIdUseCase
import com.nom.api.domain.order.ports.`in`.OrderDetail
import com.nom.api.domain.order.ports.out.OrderRepository
import org.springframework.stereotype.Service

@Service
class FinishDeliveryByCourierUseCase(
    private val orderRepository: OrderRepository,
    private val getOrderByIdUseCase: GetOrderByIdUseCase,
): FinishDeliveryByCourierUseCase {
    override fun finishDelivery(orderId: String, courierId: String): OrderDetail? {
        val order = orderRepository.findById(orderId) ?: return null

        if (order.courierId != courierId) {
            throw IllegalStateException(
                "Order $orderId does not belong to courier $courierId"
            )
        }

        if (order.status != OrderStatus.ON_DELIVERY) {
            throw IllegalStateException(
                "Only ON_DELIVERY orders can be finished delivering. Current status: ${order.status}"
            )
        }

        order.changeStatus(OrderStatus.DELIVERED)

        order.currentLocation = order.deliveryAddress?.coordinates

        orderRepository.save(order)

        return getOrderByIdUseCase.getOrderById(orderId)
    }
}