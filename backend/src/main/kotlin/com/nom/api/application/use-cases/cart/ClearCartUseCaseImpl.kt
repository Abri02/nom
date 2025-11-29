package com.nom.api.application.`use-cases`.cart

import com.nom.api.domain.cart.ports.`in`.CartDetails
import com.nom.api.domain.cart.ports.`in`.ClearCartUseCase
import com.nom.api.domain.cart.ports.out.CartRepository
import org.springframework.stereotype.Service

@Service
class ClearCartUseCaseImpl(private val cartRepository: CartRepository): ClearCartUseCase {
    override fun clearCart(customerId: String) : CartDetails {
        cartRepository.deleteByCustomerId(customerId)

        return CartDetails(
            customerId = customerId,
            restaurantId = null,
            items = emptyList(),
            totalPrice = 0
        )
    }


}