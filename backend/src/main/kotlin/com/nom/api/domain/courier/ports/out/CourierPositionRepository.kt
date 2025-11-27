package com.nom.api.domain.courier.ports.out

import com.nom.api.domain.courier.entities.CourierPosition

interface CourierPositionRepository {
    fun save(position: CourierPosition): CourierPosition
    fun findByCourierId(courierId: String): CourierPosition?
}