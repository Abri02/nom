package com.nom.api.application.`use-cases`.cart

import com.nom.api.domain.cart.entities.CartItem
import com.nom.api.domain.cart.ports.`in`.AddItemRequest
import com.nom.api.domain.cart.ports.`in`.CartDetails
import com.nom.api.domain.cart.ports.`in`.GetCartUseCase
import com.nom.api.domain.cart.ports.`in`.UpdateCartUseCase
import com.nom.api.domain.cart.ports.out.CartRepository
import org.springframework.stereotype.Service

@Service
class UpdateCartUseCaseImpl(
    private val cartRepository: CartRepository,
    private val getCartUseCase: GetCartUseCase
): UpdateCartUseCase {
    override fun updateCart(customerId: String, itemList: List<AddItemRequest>): CartDetails {
        cartRepository.deleteByCustomerId(customerId)

        itemList.forEach {request ->
            val cartItem = CartItem(
                restaurantId = request.restaurantId,
                menuItemId = request.menuItemId,
                quantity = request.quantity
            )

            cartRepository.addItemToCart(customerId, cartItem)
        }

        return getCartUseCase.getCart(customerId)
    }
}