package com.nom.api.application.usecases.order

import com.nom.api.adapters.out.persistence.mongodb.menu.MongoMenuRepository
import com.nom.api.domain.order.ports.`in`.GetOrderByUserUseCase
import com.nom.api.domain.order.ports.`in`.OrderDetail
import com.nom.api.domain.order.ports.`in`.OrderItemDetail
import com.nom.api.domain.order.ports.out.OrderRepository
import org.springframework.stereotype.Service

@Service
class GetOrderByUserUseCaseImpl(
    private val orderRepository: OrderRepository,
    private val menuRepository: MongoMenuRepository
) : GetOrderByUserUseCase {
    override fun getOrder(userId: String): List<OrderDetail> {
        val orders = orderRepository.findAllByCustomerId(userId)

        return orders.map { order ->
            val restaurantProfile = menuRepository.getRestaurantProfile(order.restaurantId)
            val restaurantName = restaurantProfile?.restaurantName ?: ""

            // Fetch menu to get item details
            val menu = menuRepository.getMenu(order.restaurantId)
            val menuItemsMap = menu?.menuItems?.associateBy { it.id } ?: emptyMap()

            // Enrich cart items with menu item details
            val enrichedItems = order.cart?.items?.mapNotNull { cartItem ->
                val menuItem = menuItemsMap[cartItem.menuItemId]
                if (menuItem != null) {
                    OrderItemDetail(
                        restaurantId = cartItem.restaurantId,
                        menuItemId = cartItem.menuItemId,
                        menuItemName = menuItem.name,
                        quantity = cartItem.quantity,
                        price = menuItem.price
                    )
                } else {
                    // If menu item not found, create a placeholder
                    OrderItemDetail(
                        restaurantId = cartItem.restaurantId,
                        menuItemId = cartItem.menuItemId,
                        menuItemName = "Unknown Item",
                        quantity = cartItem.quantity,
                        price = 0
                    )
                }
            }?.toMutableList() ?: mutableListOf()

            OrderDetail(
                id = order.id,
                customerId = order.customerId,
                restaurantId = order.restaurantId,
                restaurantName = restaurantName,
                courierId = order.courierId,
                items = enrichedItems,
                deliveryAddress = order.deliveryAddress,
                currentLocation = order.currentLocation,
                totalPrice = order.totalPrice,
                status = order.status,
                createdAt = order.createdAt
            )
        }
    }
}