package com.nom.api.domain.cart.ports.`in`

interface RemoveItemFromCartUseCase {
    fun removeItem(customerId: String, menuItemId: String) : CartDetails
}