package com.nom.api.application.usecases.courier

import com.nom.api.domain.courier.entities.CourierPosition
import com.nom.api.domain.courier.ports.`in`.ManageCourierLocationUseCase
import com.nom.api.domain.courier.ports.out.CourierPositionRepository
import com.nom.api.domain.order.entities.OrderStatus
import com.nom.api.domain.order.ports.out.OrderRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
class ManageCourierLocationUseCaseImpl(
    private val courierPositionRepository: CourierPositionRepository,
    private val orderRepository: OrderRepository
) : ManageCourierLocationUseCase {

    @Transactional
    override fun updatePosition(courierId: String, lat: Double, lon: Double) {
        val existingPos = courierPositionRepository.findByCourierId(courierId)

        val newPos = if (existingPos != null) {
            existingPos.copy(
                latitude = lat,
                longitude = lon,
                lastUpdated = LocalDateTime.now()
            )
        } else {
            CourierPosition(
                courierId = courierId,
                latitude = lat,
                longitude = lon
            )
        }

        courierPositionRepository.save(newPos)
    }

    override fun getCourierPositionByOrderId(orderId: String, customerId: String): CourierPosition {

        val order = orderRepository.findById(orderId)
            ?: throw IllegalArgumentException("Rendelés nem található")

        if (order.customerId != customerId) {
            throw IllegalAccessException("Nincs jogosultsága megtekinteni ezt a rendelést")
        }

        if (order.status != OrderStatus.ON_DELIVERY) {
            throw IllegalStateException("A futár még nem indult el vagy már megérkezett.")
        }

        val courierId = order.courierId
            ?: throw IllegalStateException("Nincs futár hozzárendelve a rendeléshez")

        return courierPositionRepository.findByCourierId(courierId)
            ?: throw IllegalStateException("A futár pozíciója nem elérhető")
    }
}