package com.nom.api.application.`use-cases`.order

import com.nom.api.application.usecases.order.GetOrderByUserUseCaseImpl
import com.nom.api.domain.order.entities.OrderStatus
import com.nom.api.domain.order.ports.`in`.GetOrderByIdUseCase
import com.nom.api.domain.order.ports.`in`.GetOrderByUserUseCase
import com.nom.api.domain.order.ports.`in`.OrderDetail
import com.nom.api.domain.order.ports.`in`.StartDeliveryByCourierUseCase
import com.nom.api.domain.order.ports.out.OrderRepository
import org.springframework.stereotype.Service

@Service
class StartDeliveryByCourierUseCaseImpl(
    private val orderRepository: OrderRepository,
    private val getOrderByIdUseCase: GetOrderByIdUseCase,
): StartDeliveryByCourierUseCase {
    override fun startDelivery(orderId: String, courierId: String): OrderDetail? {
        val order = orderRepository.findById(orderId) ?: return null

        if (order.courierId != courierId) {
            throw IllegalStateException(
                "Order $orderId does not belong to courier $courierId"
            )
        }

        if (order.status != OrderStatus.READY) {
            throw IllegalStateException(
                "Only Ready orders can be started delivering. Current status: ${order.status}"
            )
        }

        order.changeStatus(OrderStatus.ON_DELIVERY)

        orderRepository.save(order)

        return getOrderByIdUseCase.getOrderById(orderId)
    }
}