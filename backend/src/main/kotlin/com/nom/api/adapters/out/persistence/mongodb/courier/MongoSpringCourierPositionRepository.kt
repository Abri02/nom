package com.nom.api.adapters.out.persistence.mongodb.courier

import com.nom.api.domain.courier.entities.CourierPosition
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface MongoSpringCourierPositionRepository : MongoRepository<CourierPosition, String> {
    fun findByCourierId(courierId: String): CourierPosition?
}