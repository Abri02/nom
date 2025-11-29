package com.nom.api.application.`use-cases`.order

import com.nom.api.domain.menu.ports.out.MenuRepository
import com.nom.api.domain.order.ports.`in`.GetOrderByIdUseCase
import com.nom.api.domain.order.ports.`in`.OrderDetail
import com.nom.api.domain.order.ports.out.OrderRepository
import org.springframework.stereotype.Service

@Service
class GetOrderByIdUseCaseImpl(
    private val orderRepository: OrderRepository,
    private val menuRepository: MenuRepository
) : GetOrderByIdUseCase {
    override fun getOrderById(orderId: String): OrderDetail? {
        val order = orderRepository.findById(orderId)
            ?: return null

        val restaurantProfile = menuRepository.getRestaurantProfile(order.restaurantId)
        val restaurantName = restaurantProfile?.restaurantName ?: ""

        val items = order.cart?.items?.toMutableList() ?: mutableListOf()

        return OrderDetail(
            id = order.id,
            customerId = order.customerId,
            restaurantId = order.restaurantId,
            restaurantName = restaurantName,
            courierId = order.courierId,
            items = items,
            deliveryAddress = order.deliveryAddress,   // nálad most lehet még null
            currentLocation = order.currentLocation,
            totalPrice = order.totalPrice,
            status = order.status,
            createdAt = order.createdAt
        )
    }
}