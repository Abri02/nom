package com.nom.api.application.usecases.admin

import com.nom.api.domain.user.entities.User
import com.nom.api.domain.ports.out.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ManageUsersUseCaseImpl(
    private val userRepository: UserRepository
) { // Ha gondolod, csinálhatsz neki külön interfészt is (ManageUsersUseCase), de itt most egyszerűsítünk

    // Összes felhasználó listázása
    fun getAllUsers(): List<User> {
        // Ehhez a UserRepository-ban kell egy findAll() metódus!
        // Ha a MongoRepository-t használod, az alapból tudja.
        // De a Domain UserRepository interfészbe be kell tenned: fun findAll(): List<User>
        return userRepository.findAll()
    }

    // Felfüggesztés / Visszaállítás
    @Transactional
    fun toggleUserSuspension(userId: String, suspend: Boolean) {
        val user = userRepository.findById(userId)
            ?: throw IllegalArgumentException("Felhasználó nem található")

        // A User data class immutable (val), ezért copy-t csinálunk
        val updatedUser = user.copy(isSuspended = suspend)

        userRepository.save(updatedUser)
    }
}