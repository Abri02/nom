package com.nom.api.domain.courier.entities

import java.time.LocalDateTime

data class CourierPosition(
    val id: String? = null,
    val courierId: String, // Melyik futár
    val latitude: Double,
    val longitude: Double,
    val lastUpdated: LocalDateTime = LocalDateTime.now()
)