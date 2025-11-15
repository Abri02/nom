package com.nom.api.domain.ports.out

import domain.entities.User

interface UserRepository {

    suspend fun save(user: User): User

    suspend fun findById(id: String): User?

    suspend fun findByEmail(email: String): User?

    suspend fun findAll(): List<User>

    suspend fun update(user: User): User

    suspend fun delete(id: String): Boolean
}
