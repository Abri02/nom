package com.nom.api.domain.user.ports.`in`

import com.nom.api.domain.menu.entities.MenuItem

interface GetFavouriteMenuItemsUseCase {
    fun getMenuItems(userId: String): List<MenuItem>
}