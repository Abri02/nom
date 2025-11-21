package com.nom.api.domain.order.entities

import java.math.BigDecimal
import java.time.LocalDateTime

data class Order(
    val id: String? = null,
    val customerId: String,
    val restaurantId: String,
    var courierId: String? = null,
    val items: List<OrderItem>,
    val deliveryAddress: Address,
    val totalPrice: BigDecimal,
    val paymentMethod: PaymentMethod,
    var status: OrderStatus = OrderStatus.NEW,
    val createdAt: LocalDateTime = LocalDateTime.now()
) {
    fun changeStatus(newStatus: OrderStatus) {
        if(isValidTransition(this.status, newStatus)){
            this.status = newStatus
        } else {
            throw IllegalArgumentException("Invalid status transition from $status to $newStatus")
        }
    }

    private fun isValidTransition(current: OrderStatus, next: OrderStatus): Boolean{
        return when(current){
            OrderStatus.NEW -> next == OrderStatus.PREPARING || next == OrderStatus.CANCELLED
            OrderStatus.PREPARING -> next == OrderStatus.READY || next == OrderStatus.CANCELLED
            OrderStatus.READY -> next == OrderStatus.ON_DELIVERY || next == OrderStatus.CANCELLED
            OrderStatus.ON_DELIVERY -> next == OrderStatus.DELIVERED
            else -> false
        }
    }
}