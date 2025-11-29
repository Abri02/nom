package com.nom.api.application.`use-cases`.cart

import com.nom.api.domain.cart.entities.CartItem
import com.nom.api.domain.cart.ports.`in`.AddItemRequest
import com.nom.api.domain.cart.ports.`in`.AddItemToCartUseCase
import com.nom.api.domain.cart.ports.`in`.CartDetails
import com.nom.api.domain.cart.ports.`in`.GetCartUseCase
import com.nom.api.domain.cart.ports.out.CartRepository
import com.nom.api.domain.menu.ports.out.MenuRepository
import org.springframework.context.annotation.Bean
import org.springframework.stereotype.Service

@Service
class AddItemToCartUseCaseImpl(private val cartRepository: CartRepository,
                               private val menuRepository: MenuRepository,
                               private val getCartUseCase: GetCartUseCase
) : AddItemToCartUseCase {

    override fun addItem(customerId: String, command: AddItemRequest): CartDetails {
        val cartItem = CartItem(
            restaurantId = command.restaurantId,
            menuItemId =  command.menuItemId,
            quantity = command.quantity
        )

        cartRepository.addItemToCart(customerId, cartItem)

        return getCartUseCase.getCart(customerId)
    }

}