package com.nom.api.application.`use-cases`

import com.nom.api.domain.menu.entities.Menu
import com.nom.api.domain.menu.entities.RestaurantProfile
import com.nom.api.domain.menu.ports.out.MenuRepository
import com.nom.api.domain.user.entities.User
import com.nom.api.domain.ports.`in`.CreateUserRequest
import com.nom.api.domain.ports.`in`.CreateUserUseCase
import com.nom.api.domain.ports.out.UserRepository
import com.nom.api.domain.user.entities.UserRole
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.UUID

@Service
class CreateUserUseCaseImpl(
    private val userRepository: UserRepository,
    private val menuRepository: MenuRepository,
    private val passwordEncoder: PasswordEncoder
) : CreateUserUseCase {

    override suspend fun execute(request: CreateUserRequest): User {
        val existingUser = userRepository.findByEmail(request.email)
        if (existingUser != null) {
            throw IllegalArgumentException("User with email ${request.email} already exists")
        }
        if (request.role == UserRole.RESTAURANT && request.restaurantProfile == null) {
            throw IllegalArgumentException("Restaurant profile is required for RESTAURANT users")
        }

        val passwordHash = hashPassword(request.password)

        val user = User(
            id = UUID.randomUUID().toString(),
            name = request.name,
            email = request.email,
            passwordHash = passwordHash,
            phoneNumber = request.phoneNumber,
            role = request.role,
            createdAt = LocalDateTime.now(),
            ZipCode = request.ZipCode,
            City = request.City,
            Street =  request.Street,
            StreetNumber =  request.StreetNumber,
            cart = null
        )

        val savedUser = userRepository.save(user)

        if (savedUser.role == UserRole.RESTAURANT) {
            val profile = request.restaurantProfile!!
            menuRepository.updateRestaurantProfile(
                restaurantId = savedUser.id, // <- restaurantId = userId
                profile = RestaurantProfile(
                    restaurantName = profile.restaurantName,
                    openingHours = profile.openingHours,
                    menu = Menu() // induláskor üres menü
                )
            )
        }

        return savedUser
    }

    private fun hashPassword(password: String): String {
        require(password.length >= 8) { "Password must be at least 8 characters long" }
        return passwordEncoder.encode(password)
    }
}
