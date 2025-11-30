package com.nom.api.application.`use-cases`.order

import com.nom.api.domain.menu.ports.out.MenuRepository
import com.nom.api.domain.order.ports.`in`.GetAllOrderUseCase
import com.nom.api.domain.order.ports.`in`.OrderDetail
import com.nom.api.domain.order.ports.out.OrderRepository
import com.nom.api.domain.ports.out.UserRepository
import com.nom.api.domain.user.entities.UserRole
import org.springframework.stereotype.Service

@Service
class GetAllOrderUseCaseImpl(
    private val userRepository: UserRepository,
    private val orderRepository: OrderRepository,
    private val menuRepository: MenuRepository
): GetAllOrderUseCase {
    override fun getAllOrder(userId: String): List<OrderDetail> {
        val user = userRepository.findById(userId)

        if(user?.role != UserRole.ADMIN){
            throw IllegalStateException("Only admin users can access all orders")
        }

        val orders = orderRepository.findAll()
        if (orders.isEmpty()) return emptyList()

        val restaurantNamesById: Map<String, String> =
            orders
                .map { it.restaurantId }
                .distinct()
                .associateWith { restaurantId ->
                    menuRepository.getRestaurantProfile(restaurantId)?.restaurantName ?: ""
                }

        return orders.map { order ->
            val restaurantName = restaurantNamesById[order.restaurantId] ?: ""

            OrderDetail(
                id = order.id,
                customerId = order.customerId,
                restaurantId = order.restaurantId,
                restaurantName = restaurantName,
                courierId = order.courierId,
                items = order.cart?.items?.toMutableList() ?: mutableListOf(),
                deliveryAddress = order.deliveryAddress,
                currentLocation = order.currentLocation,
                totalPrice = order.totalPrice,
                status = order.status,
                createdAt = order.createdAt
            )
        }
    }
}