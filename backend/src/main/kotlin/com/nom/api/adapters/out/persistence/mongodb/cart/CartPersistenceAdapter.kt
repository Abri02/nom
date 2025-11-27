package com.nom.api.adapters.out.persistence.mongodb.cart

import com.nom.api.domain.cart.entities.Cart
import com.nom.api.domain.cart.ports.out.CartRepository
import org.springframework.stereotype.Component

@Component
class CartPersistenceAdapter(
    private val mongoSpringCartRepository: MongoSpringCartRepository
) : CartRepository {

    override fun findByCustomerId(customerId: String): Cart? {
        return mongoSpringCartRepository.findByCustomerId(customerId)
    }

    override fun save(cart: Cart): Cart {
        return mongoSpringCartRepository.save(cart)
    }

    override fun deleteByCustomerId(customerId: String) {
        mongoSpringCartRepository.deleteByCustomerId(customerId)
    }
}