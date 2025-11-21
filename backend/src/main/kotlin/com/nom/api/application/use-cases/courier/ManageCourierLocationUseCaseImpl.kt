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
    private val orderRepository: OrderRepository // Kell a rendelés ellenőrzéséhez
) : ManageCourierLocationUseCase {

    @Transactional
    override fun updatePosition(courierId: String, lat: Double, lon: Double) {
        // Megnézzük, van-e már mentett pozíciója
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
        // 1. Rendelés kikeresése
        val order = orderRepository.findById(orderId)
            ?: throw IllegalArgumentException("Rendelés nem található")

        // 2. Biztonsági ellenőrzés: A vásárló csak a saját rendelését követheti
        if (order.customerId != customerId) {
            throw IllegalAccessException("Nincs jogosultsága megtekinteni ezt a rendelést")
        }

        // 3. Státusz ellenőrzés: Csak akkor követhető, ha úton van (ON_DELIVERY) [cite: 200]
        if (order.status != OrderStatus.ON_DELIVERY) {
            throw IllegalStateException("A futár még nem indult el vagy már megérkezett.")
        }

        // 4. Futár ellenőrzés
        val courierId = order.courierId
            ?: throw IllegalStateException("Nincs futár hozzárendelve a rendeléshez")

        // 5. Pozíció lekérése
        return courierPositionRepository.findByCourierId(courierId)
            ?: throw IllegalStateException("A futár pozíciója nem elérhető")
    }
}