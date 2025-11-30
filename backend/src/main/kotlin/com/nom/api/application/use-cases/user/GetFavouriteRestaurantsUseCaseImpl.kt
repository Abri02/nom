package com.nom.api.application.`use-cases`.user

import com.nom.api.domain.menu.entities.RestaurantProfile
import com.nom.api.domain.menu.ports.out.MenuRepository
import com.nom.api.domain.ports.out.UserRepository
import com.nom.api.domain.user.ports.`in`.GetFavouriteRestaurantsUseCase
import org.springframework.stereotype.Service

@Service
class GetFavouriteRestaurantsUseCaseImpl(
    private val userRepository: UserRepository,
    private val menuRepository: MenuRepository,
): GetFavouriteRestaurantsUseCase {
    override fun getFavourites(userId: String): List<RestaurantProfile> {
        val user = userRepository.findById(userId) ?: return emptyList()

        if (user.favouriteRestaurants.isEmpty()) {
            return emptyList()
        }

        return menuRepository.findAllRestaurantByIdList(user.favouriteRestaurants)
    }
}