package com.nom.api.adapters.out.persistence.mongodb.order

import com.nom.api.domain.order.entities.Order
import com.nom.api.domain.order.entities.OrderStatus
import com.nom.api.domain.order.ports.out.OrderRepository
import org.springframework.stereotype.Component

@Component
class OrderPersistenceAdapter(
    private val mongoSpringOrderRepository: MongoSpringOrderRepository
) : OrderRepository {

    // ... save és findById már megvan ...
    override fun save(order: Order): Order = mongoSpringOrderRepository.save(order)
    override fun findById(id: String): Order? = mongoSpringOrderRepository.findById(id).orElse(null)

    // --- Új metódusok implementálása ---

    override fun findAllByRestaurantId(restaurantId: String): List<Order> {
        return mongoSpringOrderRepository.findAllByRestaurantId(restaurantId)
    }

    override fun findAllByRestaurantIdAndStatus(restaurantId: String, status: OrderStatus): List<Order> {
        return mongoSpringOrderRepository.findAllByRestaurantIdAndStatus(restaurantId, status)
    }

    override fun findAllByCustomerId(customerId: String): List<Order> {
        return mongoSpringOrderRepository.findAllByCustomerId(customerId)
    }

    override fun findAllByCourierId(courierId: String): List<Order> {
        return mongoSpringOrderRepository.findAllByCourierId(courierId)
    }

    override fun findAllByStatus(status: OrderStatus): List<Order> {
        return mongoSpringOrderRepository.findAllByStatus(status)
    }

    // Ha az Adminnak kellene minden:
   override fun findAll(): List<Order> = mongoSpringOrderRepository.findAll()
}