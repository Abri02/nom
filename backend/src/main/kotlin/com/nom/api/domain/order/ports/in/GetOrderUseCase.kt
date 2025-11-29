package com.nom.api.domain.order.ports.`in`

import com.nom.api.domain.cart.entities.CartItem
import com.nom.api.domain.order.entities.Address
import com.nom.api.domain.order.entities.GeoPoint
import com.nom.api.domain.order.entities.Order
import com.nom.api.domain.order.entities.OrderStatus
import java.time.LocalDateTime

interface GetOrderByUserUseCase {
     fun getOrder(userId: String): OrderDetail?
}