package com.nom.api.domain.order.ports.`in`

import com.nom.api.domain.cart.entities.Cart
import com.nom.api.domain.cart.entities.CartItem
import com.nom.api.domain.order.entities.Address
import com.nom.api.domain.order.entities.GeoPoint
import com.nom.api.domain.order.entities.OrderStatus
import java.time.LocalDateTime

data class OrderDetail(
    val id: String? = null,
    val customerId: String,
    val restaurantId: String,
    val restaurantName: String,
    var courierId: String? = null,
    val items: MutableList<CartItem> = mutableListOf(),
    val deliveryAddress: Address? = null,
    var currentLocation: GeoPoint? = null,
    val totalPrice: Long,
    var status: OrderStatus = OrderStatus.NEW,
    val createdAt: LocalDateTime = LocalDateTime.now(),
){

}