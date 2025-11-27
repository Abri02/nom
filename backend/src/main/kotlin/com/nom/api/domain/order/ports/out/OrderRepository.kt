package com.nom.api.domain.order.ports.out

import com.nom.api.domain.order.entities.Order
import com.nom.api.domain.order.entities.OrderStatus

interface OrderRepository{
    fun save(order: Order): Order
    fun findById(orderId: String): Order?
    fun findAllByRestaurantId(restaurantId: String): List<Order>
    fun findAllByRestaurantIdAndStatus(restaurantId: String, status: OrderStatus): List<Order>
    fun findAllByCustomerId(customerId: String): List<Order>
    fun findAllByCourierId(courierId: String): List<Order>
    fun findAllByStatus(status: OrderStatus): List<Order>
    fun findAll(): List<Order>
}