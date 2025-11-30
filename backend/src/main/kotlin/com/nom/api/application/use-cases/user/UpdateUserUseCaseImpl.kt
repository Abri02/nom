package com.nom.api.application.`use-cases`.user

import com.nom.api.domain.ports.out.UserRepository
import com.nom.api.domain.user.entities.User
import com.nom.api.domain.user.entities.UserRole
import com.nom.api.domain.user.ports.`in`.UpdateUserRequest
import com.nom.api.domain.user.ports.`in`.UpdateUserUseCase
import org.springframework.stereotype.Service


@Service
class UpdateUserUseCaseImpl(
    private val userRepository: UserRepository
) : UpdateUserUseCase {
    override suspend fun updateUser(request: UpdateUserRequest): User {
        val existingUser = userRepository.findById(request.id)
            ?: throw IllegalArgumentException("User not found with id: ${request.id}")

        val updatedUser = existingUser.copy(
            name = request.name,
            email = request.email,
            phoneNumber = request.phoneNumber,
            Street = request.street,
            StreetNumber = request.streetNumber,
            City = request.city,
            ZipCode = request.zipCode,
            role = UserRole.valueOf(request.role.name)


        )

        return userRepository.save(updatedUser)
    }
}