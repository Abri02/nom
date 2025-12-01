package com.nom.api.application.`use-cases`.user

import com.nom.api.domain.ports.out.UserRepository
import com.nom.api.domain.user.entities.User
import com.nom.api.domain.user.ports.`in`.GetUserByIdUseCase
import org.springframework.stereotype.Service

@Service
class GetUserByIdUseCaseImpl (
    private val userRepository: UserRepository
): GetUserByIdUseCase {

    override fun getUserById(userId: String): User? {
        val user = userRepository.findById(userId)
            ?: throw IllegalArgumentException("Felhasználó nem található")
        return user
    }
}