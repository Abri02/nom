package com.nom.api.domain.user.ports.`in`

import com.nom.api.domain.user.entities.User

interface GetRandomCourierUseCase {
    fun getRadnomCourier(): User?
}