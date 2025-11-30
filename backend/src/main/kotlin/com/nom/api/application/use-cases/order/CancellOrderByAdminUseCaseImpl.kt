package com.nom.api.application.`use-cases`.order

import com.nom.api.domain.order.entities.OrderStatus
import com.nom.api.domain.order.ports.`in`.CancellOrderByAdminUseCase
import com.nom.api.domain.order.ports.out.OrderRepository
import com.nom.api.domain.ports.out.UserRepository
import com.nom.api.domain.user.entities.UserRole
import org.springframework.stereotype.Service

@Service
class CancellOrderByAdminUseCaseImpl(
    private val userRepository: UserRepository,
    private val orderRepository: OrderRepository,
): CancellOrderByAdminUseCase {
    override fun cancelOrderByAdmin(orderId: String, userId: String) {
        val user =  userRepository.findById(userId)

        if(user?.role != UserRole.ADMIN){
            throw IllegalStateException("Only admin users can access all orders")
        }

        val order = orderRepository.findById(orderId) ?: throw IllegalStateException("Order not found")

        order.status = OrderStatus.CANCELLED

        orderRepository.save(order)
    }

}