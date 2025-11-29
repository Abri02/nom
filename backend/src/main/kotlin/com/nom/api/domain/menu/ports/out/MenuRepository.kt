package com.nom.api.domain.menu.ports.out

import com.nom.api.domain.menu.entities.Menu
import com.nom.api.domain.menu.entities.MenuItem
import com.nom.api.domain.menu.entities.RestaurantProfile

interface MenuRepository {

    fun getRestaurantProfile(restaurantId: String): RestaurantProfile?

    fun updateRestaurantProfile(
        restaurantId: String,
        profile: RestaurantProfile
    ): RestaurantProfile

    fun getMenu(restaurantId: String): Menu?

    fun addMenuItem(
        restaurantId: String,
        item: MenuItem
    ): MenuItem


    fun updateMenuItem(
        restaurantId: String,
        item: MenuItem
    ): MenuItem

    fun deleteMenuItem(
        restaurantId: String,
        menuItemId: String
    ): Boolean

    fun findAllRestaurants(): List<RestaurantProfile>

    fun findByRestaurantId(restaurantId: String): Menu?
}