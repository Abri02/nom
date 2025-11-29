package com.nom.api.domain.cart.entities

data class Cart(
    val id: String? = null,
    val customerId: String? = null,
    var restaurantId: String? = null,
    val items: MutableList<CartItem> = mutableListOf(),
    var totalPrice: Long = 0
) {

}