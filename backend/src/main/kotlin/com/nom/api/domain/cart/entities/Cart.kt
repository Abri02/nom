package com.nom.api.domain.cart.entities

import java.math.BigDecimal

data class Cart(
    val id: String? = null,
    val customerId: String? = null,      // Kié a kosár
    var restaurantId: String? = null, // Melyik étteremből (null, ha üres)
    val items: MutableList<CartItem> = mutableListOf(),
    var totalPrice: BigDecimal = BigDecimal.ZERO
) {
    // Segédfüggvény az újraszámoláshoz
    fun calculateTotal() {
        totalPrice = items.fold(BigDecimal.ZERO) { acc, item ->
            acc + (item.price * item.quantity.toBigDecimal())
        }
    }
}