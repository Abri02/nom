package com.nom.api.application.`use-cases`.order

import com.nom.api.domain.menu.ports.out.MenuRepository
import com.nom.api.domain.order.ports.`in`.GetOrderByIdUseCase
import com.nom.api.domain.order.ports.`in`.OrderDetail
import com.nom.api.domain.order.ports.`in`.OrderItemDetail
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
                OrderItemDetail(
                    restaurantId = cartItem.restaurantId,
                    menuItemId = cartItem.menuItemId,
                    menuItemName = "Unknown Item",
                    quantity = cartItem.quantity,
                    price = 0
                )
            }
        }?.toMutableList() ?: mutableListOf()

        return OrderDetail(
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