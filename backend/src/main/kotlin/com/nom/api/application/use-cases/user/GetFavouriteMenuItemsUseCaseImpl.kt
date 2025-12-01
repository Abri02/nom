package com.nom.api.application.`use-cases`.user

import com.nom.api.domain.menu.entities.MenuItem
import com.nom.api.domain.menu.ports.out.MenuRepository
import com.nom.api.domain.ports.out.UserRepository
import com.nom.api.domain.user.ports.`in`.GetFavouriteMenuItemsUseCase
import org.springframework.stereotype.Service

@Service
class GetFavouriteMenuItemsUseCaseImpl(
    private val menuRepository: MenuRepository,
    private val userRepository: UserRepository
): GetFavouriteMenuItemsUseCase {
    override fun getMenuItems(userId: String): List<MenuItem> {
        val user = userRepository.findById(userId)
            ?: throw IllegalArgumentException("User not found with id: $userId")

        if(user.favouriteMenuItems.isEmpty()){
            return emptyList()
        }

        return menuRepository.findAllMenuItemByIdList(user.favouriteMenuItems)
    }
}