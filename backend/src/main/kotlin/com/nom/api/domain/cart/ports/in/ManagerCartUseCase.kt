package com.nom.api.domain.cart.ports.`in`

import com.nom.api.domain.cart.entities.Cart

interface ManageCartUseCase {
    fun getCart(customerId: String): Cart
    fun addItem(customerId: String, command: AddItemCommand)
    fun removeItem(customerId: String, menuItemId: String)
    fun clearCart(customerId: String)
}

data class AddItemCommand(
    val restaurantId: String,
    val menuItemId: String,
    val quantity: Int
)