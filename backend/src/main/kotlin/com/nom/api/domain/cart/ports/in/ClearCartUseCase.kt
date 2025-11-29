package com.nom.api.domain.cart.ports.`in`

interface ClearCartUseCase {
    fun clearCart(customerId: String) : CartDetails
}