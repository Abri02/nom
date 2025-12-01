package com.nom.api.application.`use-cases`.order

import com.nom.api.domain.menu.ports.out.MenuRepository
import com.nom.api.domain.order.entities.OrderStatus
import com.nom.api.domain.order.ports.`in`.GetOrderByRestaurantAndStatusUseCase
import com.nom.api.domain.order.ports.`in`.OrderDetail
import com.nom.api.domain.order.ports.`in`.OrderItemDetail
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

        // Fetch menu once since all orders are from same restaurant
        val menu = menuRepository.getMenu(restaurantId)
        val menuItemsMap = menu?.menuItems?.associateBy { it.id } ?: emptyMap()

        return orders.map { order ->
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