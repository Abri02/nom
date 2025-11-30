package com.nom.api.application.usecases.order

import com.nom.api.adapters.`in`.http.controllers.UserResponse
import com.nom.api.domain.cart.ports.`in`.ClearCartUseCase
import com.nom.api.domain.cart.ports.out.CartRepository
import com.nom.api.domain.menu.entities.Menu
import com.nom.api.domain.menu.ports.out.MenuRepository
import com.nom.api.domain.order.entities.Order
import com.nom.api.domain.order.entities.OrderStatus
import com.nom.api.domain.order.entities.PaymentMethod // <-- Fontos
import com.nom.api.domain.order.ports.`in`.CreateOrderUseCase
import com.nom.api.domain.order.ports.`in`.OrderDetail
import com.nom.api.domain.order.ports.out.OrderRepository
import com.nom.api.domain.payment.ports.out.PaymentGateway // <-- Fontos: Az új port
import com.nom.api.domain.ports.out.UserRepository
import com.nom.api.geoCode.GeocodingService
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import java.math.BigDecimal
import java.util.*

@Service
class CreateOrderUseCaseImpl(
    private val orderRepository: OrderRepository,
    private val menuRepository: MenuRepository,
    private val cartRepository: CartRepository,
    private val clearCartUseCase: ClearCartUseCase,
    private val userRepository: UserRepository,
    private val geocodingService: GeocodingService
) : CreateOrderUseCase {

    override fun createOrder(userId: String): OrderDetail {
        val cart = cartRepository.findByCustomerId(userId)
            ?: throw IllegalStateException("Cannot create order: cart is empty")

        if (cart.items.isEmpty()) {
            throw IllegalStateException("Cannot create order: cart has no items")
        }

        val restaurantId = cart.restaurantId
            ?: throw IllegalStateException("Cannot create order: cart has no restaurantId")
        val restaurantProfile = menuRepository.getRestaurantProfile(restaurantId)
            ?: throw IllegalStateException("Restaurant not found: $restaurantId")

        val menusByRestaurant: Map<String, Menu?> =
            cart.items
                .map { it.restaurantId }
                .distinct()
                .associateWith { rid ->
                    menuRepository.findByRestaurantId(rid)
                }

        val totalPrice = cart.items.sumOf { item ->
            val menu = menusByRestaurant[item.restaurantId]
            val menuItem = menu?.menuItems?.firstOrNull { it.id == item.menuItemId }
            if (menuItem != null) {
                menuItem.price * item.quantity
            } else {
                0L // ha közben törölték a menüpontot, nem számoljuk bele
            }
        }

        val cartSnapshot = cart.copy(
            items = cart.items.map { it.copy()}.toMutableList(),
            totalPrice = totalPrice,
        )

        val user = userRepository.findById(userId)
            ?: throw IllegalStateException("User not found: $userId")
        val baseAddress = user.toAddress()

        val coordinates = try {
            geocodingService.geocode(baseAddress)
        } catch (ex: Exception) {
            // ide tehetsz logger-t is
            null
        }

        val restaurant = userRepository.findById(restaurantId)
            ?: throw IllegalStateException("User not found: $userId")
        val restaurantAddress = restaurant.toAddress()

        val restaurantCoordinates = try {
            geocodingService.geocode(restaurantAddress)
        } catch (ex: Exception) {
            // ide tehetsz logger-t is
            null
        }



        val deliveryAddress = baseAddress.copy(coordinates = coordinates)
        val currentLocation = restaurantCoordinates

        val order = Order(
            id = UUID.randomUUID().toString(),
            customerId = userId,
            restaurantId = restaurantId,
            courierId = null,
            deliveryAddress = deliveryAddress,
            currentLocation = currentLocation,
            totalPrice = totalPrice,
            status = OrderStatus.NEW,
            cart = cartSnapshot
        )

        val saved = orderRepository.save(order)

        clearCartUseCase.clearCart(userId)

        return OrderDetail(
            id  = saved.id,
            customerId = saved.customerId,
            restaurantId = saved.restaurantId,
            restaurantName = restaurantProfile.restaurantName,
            courierId = saved.courierId,
            items = cart.items.toMutableList(),
            deliveryAddress = deliveryAddress,
            currentLocation = currentLocation,
            totalPrice = saved.totalPrice,
            status = saved.status,
            createdAt = saved.createdAt,
        )
    }
}