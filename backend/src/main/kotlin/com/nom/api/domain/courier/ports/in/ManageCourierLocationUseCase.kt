package com.nom.api.domain.courier.ports.`in`

import com.nom.api.domain.courier.entities.CourierPosition

interface ManageCourierLocationUseCase {

    fun updatePosition(courierId: String, lat: Double, lon: Double)

    fun getCourierPositionByOrderId(orderId: String, customerId: String): CourierPosition
}