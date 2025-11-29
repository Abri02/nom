package com.nom.api.domain.cart.ports.out

import com.nom.api.domain.cart.entities.Cart
import com.nom.api.domain.cart.entities.CartItem
import org.springframework.stereotype.Repository

interface CartRepository {
    fun findByCustomerId(customerId: String): Cart?
    fun createCart(customerId: String): Cart
    fun deleteByCustomerId(customerId: String)
    fun addItemToCart(customerId: String, cartItem: CartItem): Cart
    fun deleteItemFromCart(customerId: String, menuItemId: String): Cart
}