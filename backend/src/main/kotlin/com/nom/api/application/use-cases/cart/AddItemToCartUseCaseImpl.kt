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
                               private val getCartUseCase: GetCartUseCase
) : AddItemToCartUseCase {

    override fun addItem(customerId: String, command: AddItemRequest): CartDetails {
        val existingCart = cartRepository.findByCustomerId(customerId)

        if (existingCart != null && existingCart.items.isNotEmpty()) {
            val existingRestaurantId =
                existingCart.restaurantId
                    ?: existingCart.items.firstOrNull()?.restaurantId

            if (existingRestaurantId != null && existingRestaurantId != command.restaurantId) {
                throw IllegalStateException(
                    "A kosárban már egy másik étterem (${existingRestaurantId}) tételei vannak. " +
                            "Nem adhatsz hozzá másik étteremből származó tételt."
                )
            }
        }

        val cartItem = CartItem(
            restaurantId = command.restaurantId,
            menuItemId =  command.menuItemId,
            quantity = command.quantity
        )

        cartRepository.addItemToCart(customerId, cartItem)

        return getCartUseCase.getCart(customerId)
    }

}