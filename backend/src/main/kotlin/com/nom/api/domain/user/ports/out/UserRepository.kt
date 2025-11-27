package com.nom.api.domain.ports.out

import com.nom.api.domain.user.entities.User

interface UserRepository {

     fun save(user: User): User

     fun findById(id: String): User?

     fun findByEmail(email: String): User?

     fun findAll(): List<User>

    suspend fun update(user: User): User

    suspend fun delete(id: String): Boolean

    suspend fun findAllRestaurants(cuisineType: String?): List<User>
}
