package com.nom.api.domain.order.entities

data class Address(
    val houseNumber : Int,
    val street: String,
    val city: String,
    val postalCode: String,
    val coordinates: GeoPoint? = null
)

data class GeoPoint(
    val latitude: Double,
    val longitude: Double
)