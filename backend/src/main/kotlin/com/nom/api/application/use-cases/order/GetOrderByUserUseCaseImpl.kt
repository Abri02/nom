package com.nom.api.application.usecases.order

import com.nom.api.adapters.out.persistence.mongodb.menu.MongoMenuRepository
import com.nom.api.domain.order.ports.`in`.GetOrderByUserUseCase
import com.nom.api.domain.order.ports.`in`.OrderDetail
import com.nom.api.domain.order.ports.out.OrderRepository
import org.springframework.stereotype.Service

@Service
class GetOrderByUserUseCaseImpl(
    private val orderRepository: OrderRepository,
    private val menuRepository: MongoMenuRepository
) : GetOrderByUserUseCase {
    override fun getOrder(userId: String): OrderDetail? {
        val order = orderRepository.findByCustomerId(userId)
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
            deliveryAddress = order.deliveryAddress,
            currentLocation = order.currentLocation,
            totalPrice = order.totalPrice,
            status = order.status,
            createdAt = order.createdAt
        )
    }
}