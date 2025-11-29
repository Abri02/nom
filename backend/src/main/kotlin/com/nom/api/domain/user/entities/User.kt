package com.nom.api.domain.user.entities

import com.nom.api.domain.cart.entities.Cart
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
    val description: String? = null, //pl ahhoz hogy milyen konyha
    val isSuspended: Boolean = false,
    val cart: Cart?,

    val createdAt: LocalDateTime = LocalDateTime.now()
) {
    init {
        require(name.isNotBlank()) { "Name cannot be blank" }
        require(email.contains("@")) { "Invalid email format" }
        require(phoneNumber.isNotBlank()) { "Phone number cannot be blank" }

    }
}

enum class UserRole {
    CUSTOMER,
    RESTAURANT,
    COURIER,
    ADMIN,
    UNKNOWN;
}
