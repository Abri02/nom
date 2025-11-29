package com.nom.api.application.`use-cases`.order

import com.nom.api.domain.menu.ports.out.MenuRepository
import com.nom.api.domain.order.entities.OrderStatus
import com.nom.api.domain.order.ports.`in`.GetOrderByRestaurantAndStatusUseCase
import com.nom.api.domain.order.ports.`in`.OrderDetail
import com.nom.api.domain.order.ports.out.OrderRepository
import org.springframework.stereotype.Service

@Service
class GetOrderByRestaurantAndStatusUseCaseImpl(
    private val orderRepository: OrderRepository,
    private val menuRepository: MenuRepository,
): GetOrderByRestaurantAndStatusUseCase {
    override fun getOrder(restaurantId: String, status: OrderStatus): List<OrderDetail> {
        val orders = orderRepository.findAllByRestaurantIdAndStatus(restaurantId, status)

        if(orders.isEmpty()) return emptyList()

        val restaurantProfile = menuRepository.getRestaurantProfile(restaurantId)
        val restaurantName = restaurantProfile?.restaurantName ?: ""

        return orders.map { order ->
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