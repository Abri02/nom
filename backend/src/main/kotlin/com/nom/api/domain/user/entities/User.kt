package com.nom.api.domain.user.entities

import com.nom.api.domain.cart.entities.Cart
import com.nom.api.domain.order.entities.Address
import java.time.LocalDateTime

data class User(
    val id: String,
    val name: String,
    val email: String,
    val passwordHash: String,
    val phoneNumber: String,
    val ZipCode : String,
    val City: String,
    val Street: String,
    val StreetNumber: String,
    val role: UserRole,
    val description: String? = null,
    val isSuspended: Boolean = false,
    val cart: Cart?,
    val favouriteRestaurants: MutableList<String> = mutableListOf(),

    val createdAt: LocalDateTime = LocalDateTime.now()
) {
    init {
        require(name.isNotBlank()) { "Name cannot be blank" }
        require(email.contains("@")) { "Invalid email format" }
        require(phoneNumber.isNotBlank()) { "Phone number cannot be blank" }

    }

    fun toAddress(): Address? {
        if (Street.isBlank() || City.isBlank() || ZipCode.isBlank() || StreetNumber.isBlank()) {
            return null
        }

        val houseNumber = StreetNumber.toIntOrNull() ?: return null
        return Address(
            houseNumber = houseNumber,
            street = Street,
            city = City,
            postalCode = ZipCode
        )
    }
}

enum class UserRole {
    CUSTOMER,
    RESTAURANT,
    COURIER,
    ADMIN,
    UNKNOWN;
}
