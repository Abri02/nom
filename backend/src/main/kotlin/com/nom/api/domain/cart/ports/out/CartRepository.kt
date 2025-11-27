package com.nom.api.domain.cart.ports.out

import com.nom.api.domain.cart.entities.Cart

interface CartRepository {
    fun findByCustomerId(customerId: String): Cart?
    fun save(cart: Cart): Cart
    fun deleteByCustomerId(customerId: String)
}