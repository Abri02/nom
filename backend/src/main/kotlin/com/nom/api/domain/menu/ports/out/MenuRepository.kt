package com.nom.api.domain.menu.ports.out

import com.nom.api.domain.menu.entities.Menu
import com.nom.api.domain.menu.entities.MenuItem
import com.nom.api.domain.menu.entities.RestaurantProfile

interface MenuRepository {

    suspend fun getRestaurantProfile(restaurantId: String): RestaurantProfile?

    suspend fun updateRestaurantProfile(
        restaurantId: String,
        profile: RestaurantProfile
    ): RestaurantProfile

    suspend fun getMenu(restaurantId: String): Menu?

    suspend fun addMenuItem(
        restaurantId: String,
        item: MenuItem
    ): MenuItem


    suspend fun updateMenuItem(
        restaurantId: String,
        item: MenuItem
    ): MenuItem

    suspend fun deleteMenuItem(
        restaurantId: String,
        menuItemId: String
    ): Boolean

    suspend fun findAllRestaurants(): List<RestaurantProfile>
}