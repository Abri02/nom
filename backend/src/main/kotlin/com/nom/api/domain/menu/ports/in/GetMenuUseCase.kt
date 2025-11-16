package com.nom.api.domain.menu.ports.`in`

import com.nom.api.domain.menu.entities.Menu

interface GetMenuUseCase {
    suspend fun execute(restaurantId: String): Menu?
}