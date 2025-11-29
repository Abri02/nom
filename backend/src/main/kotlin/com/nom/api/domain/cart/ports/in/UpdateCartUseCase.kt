package com.nom.api.domain.cart.ports.`in`

interface UpdateCartUseCase {
    fun updateCart(customerId: String, itemList: List<AddItemRequest>) : CartDetails
}