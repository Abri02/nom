package com.nom.api.domain.user.ports.`in`

import com.nom.api.domain.user.entities.User

interface GetUserByIdUseCase {
    fun getUserById(userId: String) : User?
}
