package com.nom.api.domain.courier.ports.`in`

import com.nom.api.domain.courier.entities.CourierPosition

interface ManageCourierLocationUseCase {
    // Futár hívja: frissíti a saját pozícióját
    fun updatePosition(courierId: String, lat: Double, lon: Double)

    // Vásárló hívja: lekéri a futár pozícióját a rendelés alapján
    fun getCourierPositionByOrderId(orderId: String, customerId: String): CourierPosition
}