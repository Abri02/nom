package com.nom.api.application.`use-cases`.menu

import com.nom.api.domain.menu.entities.RestaurantProfile
import com.nom.api.domain.menu.ports.`in`.GetAllRestaurantUseCase
import com.nom.api.domain.menu.ports.out.MenuRepository
import com.nom.api.domain.ports.out.UserRepository
import com.nom.api.domain.user.entities.User
import org.springframework.stereotype.Service

@Service
class GetAllRestaurantUseCaseImpl(
    private val menuRepository: MenuRepository,
    private val userRepository: UserRepository
) : GetAllRestaurantUseCase {

    override suspend fun execute(): List<User> {
        return userRepository.findAllRestaurants("mi")
    }

}