package com.nom.api.domain.cart.ports.`in`

interface AddItemToCartUseCase {
    fun addItem(customerId: String, command: AddItemRequest): CartDetails
}

data class AddItemRequest(
    val restaurantId: String,
    val menuItemId: String,
    val quantity: Int
)