package com.nom.api.application.`use-cases`.cart

import com.nom.api.domain.cart.ports.`in`.CartDetails
import com.nom.api.domain.cart.ports.`in`.GetCartUseCase
import com.nom.api.domain.cart.ports.`in`.RemoveItemFromCartUseCase
import com.nom.api.domain.cart.ports.out.CartRepository
import com.nom.api.domain.menu.ports.out.MenuRepository
import org.springframework.stereotype.Service

@Service
class RemoveItemFromCartUseCaseImpl(private val cartRepository: CartRepository,
                                    private val getCartUseCase: GetCartUseCase
): RemoveItemFromCartUseCase {

    override fun removeItem(customerId: String, menuItemId: String) : CartDetails {
        cartRepository.deleteItemFromCart(customerId, menuItemId)

        return getCartUseCase.getCart(customerId)
    }
}