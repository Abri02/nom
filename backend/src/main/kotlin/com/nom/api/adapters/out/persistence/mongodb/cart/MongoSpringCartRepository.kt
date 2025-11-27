package com.nom.api.adapters.out.persistence.mongodb.cart

import com.nom.api.domain.cart.entities.Cart
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface MongoSpringCartRepository : MongoRepository<Cart, String> {
    // A Spring automatikusan legenerálja ezt a metódust a mezőnév alapján:
    fun findByCustomerId(customerId: String): Cart?
    fun deleteByCustomerId(customerId: String)
}