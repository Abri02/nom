package com.nom.api.adapters.out.persistence.mongodb.order

import com.nom.api.domain.order.entities.Order
import com.nom.api.domain.order.entities.OrderStatus
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface MongoSpringOrderRepository : MongoRepository<Order, String> {
    fun findAllByRestaurantId(restaurantId: String): List<Order>
    fun findAllByRestaurantIdAndStatus(restaurantId: String, status: OrderStatus): List<Order>
    fun findAllByCustomerId(customerId: String): List<Order>
    fun findAllByCourierId(courierId: String): List<Order>
    fun findAllByStatus(status: OrderStatus): List<Order>
}