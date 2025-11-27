package com.nom.api.application.`use-cases`.restaurant

import com.nom.api.domain.ports.out.UserRepository
import com.nom.api.domain.restaurant.ports.`in`.GetRestaurantsUseCase
import com.nom.api.domain.user.entities.User
import org.springframework.stereotype.Service

@Service
class GetRestaurantsUseCaseImpl(
    private val userRepository: UserRepository // Ezt bővíteni kell!
) : GetRestaurantsUseCase {

    override suspend fun getRestaurants(cuisineType: String?): List<User> {
        // Itt kérjük le azokat a felhasználókat, akiknek a ROLE-ja RESTAURANT
        // Ha van konyha típus szűrés (cuisineType), azt is itt kezeljük
        return userRepository.findAllRestaurants(cuisineType)
    }
}