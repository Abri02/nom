package com.nom.api.application.`use-cases`.order

import com.nom.api.domain.cart.entities.Cart
import com.nom.api.domain.cart.entities.CartItem
import com.nom.api.domain.menu.ports.out.MenuRepository
import com.nom.api.domain.order.entities.Order
import com.nom.api.domain.order.ports.`in`.OrderDetail
import com.nom.api.domain.order.ports.`in`.OrderItemDetail
import com.nom.api.domain.order.ports.`in`.UpdateOrderByAdminUseCase
import com.nom.api.domain.order.ports.out.OrderRepository
import com.nom.api.domain.ports.out.UserRepository
import com.nom.api.domain.user.entities.UserRole
import org.springframework.stereotype.Service

@Service
class UpdateOrderByAdminUseCaseImpl(
    private val orderRepository: OrderRepository,
    private val userRepository: UserRepository,
    private val menuRepository: MenuRepository,
): UpdateOrderByAdminUseCase {
    override fun updateOrder(order: OrderDetail, userId: String): OrderDetail {
        val user = userRepository.findById(userId)
            ?: throw IllegalArgumentException("User not found with id: $userId")

        if (user.role != UserRole.ADMIN) {
            throw IllegalStateException("Only ADMIN users can update an order this way")
        }

        val orderId = order.id
            ?: throw IllegalArgumentException("Order id must not be null")

        val existing = orderRepository.findById(orderId)
            ?: throw IllegalArgumentException("Order not found with id: $orderId")

        val cartItems = order.items.map { itemDetail ->
            CartItem(
                restaurantId = itemDetail.restaurantId,
                menuItemId = itemDetail.menuItemId,
                quantity = itemDetail.quantity
            )
        }.toMutableList()

        val updatedCart = Cart(
            id = existing.cart?.id,
            customerId = existing.customerId,
            restaurantId = existing.restaurantId,
            items = cartItems,
            totalPrice = order.totalPrice
        )

        val updatedOrder = Order(
            id = existing.id,
            customerId = existing.customerId,
            restaurantId = existing.restaurantId,
            courierId = order.courierId,
            cart = updatedCart,
            deliveryAddress = order.deliveryAddress,
            currentLocation = order.currentLocation,
            totalPrice = order.totalPrice,
            status = order.status,
            createdAt = existing.createdAt
        )

        val saved = orderRepository.save(updatedOrder)

        // Fetch menu to enrich items
        val menu = menuRepository.getMenu(saved.restaurantId)
        val menuItemsMap = menu?.menuItems?.associateBy { it.id } ?: emptyMap()

        // Convert CartItem back to OrderItemDetail
        val enrichedItems = saved.cart?.items?.mapNotNull { cartItem ->
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
            id = saved.id,
            customerId = saved.customerId,
            restaurantId = saved.restaurantId,
            restaurantName = order.restaurantName,
            courierId = saved.courierId,
            items = enrichedItems,
            deliveryAddress = saved.deliveryAddress,
            currentLocation = saved.currentLocation,
            totalPrice = saved.totalPrice,
            status = saved.status,
            createdAt = saved.createdAt
        )
    }
}