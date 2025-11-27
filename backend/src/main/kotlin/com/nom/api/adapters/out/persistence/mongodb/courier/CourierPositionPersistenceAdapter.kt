package com.nom.api.adapters.out.persistence.mongodb.courier

import com.nom.api.domain.courier.entities.CourierPosition
import com.nom.api.domain.courier.ports.out.CourierPositionRepository
import org.springframework.stereotype.Component

@Component
class CourierPositionPersistenceAdapter(
    private val mongoRepository: MongoSpringCourierPositionRepository
) : CourierPositionRepository {

    override fun save(position: CourierPosition): CourierPosition {
        return mongoRepository.save(position)
    }

    override fun findByCourierId(courierId: String): CourierPosition? {
        return mongoRepository.findByCourierId(courierId)
    }
}