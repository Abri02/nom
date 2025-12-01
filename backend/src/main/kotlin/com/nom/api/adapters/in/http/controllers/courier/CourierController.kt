package com.nom.api.adapters.`in`.http.controllers.courier

import com.nom.api.domain.courier.entities.CourierPosition
import com.nom.api.domain.courier.ports.`in`.ManageCourierLocationUseCase
import com.nom.api.domain.ports.out.UserRepository
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/courier")
class CourierController(
    private val manageCourierLocationUseCase: ManageCourierLocationUseCase,
    private val userRepository: UserRepository
) {

    @PutMapping("/position")
    fun updatePosition(
        @RequestBody request: UpdatePositionRequest,
        @AuthenticationPrincipal email: String?
    ): ResponseEntity<Void> {
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()
        val user = userRepository.findByEmail(email) ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()

        manageCourierLocationUseCase.updatePosition(
            courierId = user.id!!,
            lat = request.lat,
            lon = request.lon
        )
        return ResponseEntity.ok().build()
    }

    @GetMapping("/track/{orderId}")
    fun trackOrder(
        @PathVariable orderId: String,
        @AuthenticationPrincipal email: String?
    ): ResponseEntity<CourierPosition> {
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()
        val user = userRepository.findByEmail(email) ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()

        val position = manageCourierLocationUseCase.getCourierPositionByOrderId(
            orderId = orderId,
            customerId = user.id!!
        )

        return ResponseEntity.ok(position)
    }
}

data class UpdatePositionRequest(val lat: Double, val lon: Double)