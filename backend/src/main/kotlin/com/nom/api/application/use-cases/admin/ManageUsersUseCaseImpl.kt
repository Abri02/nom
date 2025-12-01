package com.nom.api.application.usecases.admin

import com.nom.api.domain.user.entities.User
import com.nom.api.domain.ports.out.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ManageUsersUseCaseImpl(
    private val userRepository: UserRepository
) {

    fun getAllUsers(): List<User> {
        return userRepository.findAll()
    }

    @Transactional
    fun toggleUserSuspension(userId: String, suspend: Boolean) {
        val user = userRepository.findById(userId)
            ?: throw IllegalArgumentException("Felhasználó nem található")

        val updatedUser = user.copy(isSuspended = suspend)

        userRepository.save(updatedUser)
    }
}