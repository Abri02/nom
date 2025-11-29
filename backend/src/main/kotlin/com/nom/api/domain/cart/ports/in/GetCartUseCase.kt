package com.nom.api.domain.cart.ports.`in`

import com.nom.api.domain.cart.entities.Cart
import org.springframework.stereotype.Service

interface GetCartUseCase {
    fun getCart(customerId: String): CartDetails
}

data class CartItemDetails(
    val restaurantId: String,
    val menuItemId: String,
    val name: String,
    val price: Long,
    val quantity: Int,
    val lineTotal: Long,
    val imageUrl: String?
)

data class CartDetails(
    val customerId: String,
    val restaurantId: String?,
    val items: List<CartItemDetails>,
    val totalPrice: Long
)