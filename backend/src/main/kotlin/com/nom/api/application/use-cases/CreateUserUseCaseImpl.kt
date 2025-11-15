package com.nom.api.application.`use-cases`

import domain.entities.User
import com.nom.api.domain.ports.`in`.CreateUserRequest
import com.nom.api.domain.ports.`in`.CreateUserUseCase
import com.nom.api.domain.ports.out.UserRepository
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.UUID

@Service
class CreateUserUseCaseImpl(
    private val userRepository: UserRepository
) : CreateUserUseCase {

    override suspend fun execute(request: CreateUserRequest): User {
        val existingUser = userRepository.findByEmail(request.email)
        if (existingUser != null) {
            throw IllegalArgumentException("User with email ${request.email} already exists")
        }

        val passwordHash = hashPassword(request.password)

        val user = User(
            id = UUID.randomUUID().toString(),
            name = request.name,
            email = request.email,
            passwordHash = passwordHash,
            phoneNumber = request.phoneNumber,
            role = request.role,
            createdAt = LocalDateTime.now()
        )

        return userRepository.save(user)
    }

    private fun hashPassword(password: String): String {
        require(password.length >= 8) { "Password must be at least 8 characters long" }
        // TODO: Replace with actual password hashing
        return "hashed_$password"
    }
}
