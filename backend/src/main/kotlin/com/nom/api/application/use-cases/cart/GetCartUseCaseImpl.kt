package com.nom.api.application.`use-cases`.cart

import com.nom.api.domain.cart.ports.`in`.CartDetails
import com.nom.api.domain.cart.ports.`in`.CartItemDetails
import com.nom.api.domain.cart.ports.`in`.GetCartUseCase
import com.nom.api.domain.cart.ports.out.CartRepository
import com.nom.api.domain.menu.entities.Menu
import com.nom.api.domain.menu.ports.out.MenuRepository
import org.springframework.stereotype.Service

@Service
class GetCartUseCaseImpl(private val cartRepository: CartRepository,
                         private val menuRepository: MenuRepository
) : GetCartUseCase {
    override fun getCart(customerId: String): CartDetails {
        val cart =  cartRepository.findByCustomerId(customerId)
            ?: return CartDetails(
                customerId = customerId,
                restaurantId = null,
                items = emptyList(),
                totalPrice = 0
            )
        if(cart.items.isEmpty()){
            return CartDetails(
                customerId = customerId,
                restaurantId = cart.restaurantId,
                items = emptyList(),
                totalPrice = 0
            )
        }

        val menusByRestaurant: Map<String, Menu?> =
            cart.items
                .map { it.restaurantId }
                .distinct()
                .associateWith { restaurantId ->
                    menuRepository.findByRestaurantId(restaurantId)
                }

        val detailedItems = cart.items.mapNotNull { item ->
            val menu = menusByRestaurant[item.restaurantId]
            val menuItem = menu?.menuItems?.firstOrNull { it.id == item.menuItemId }

            if (menuItem == null) {
                null
            } else {
                val lineTotal = menuItem.price * item.quantity

                CartItemDetails(
                    restaurantId = item.restaurantId,
                    menuItemId = item.menuItemId,
                    name = menuItem.name,
                    price = menuItem.price,
                    quantity = item.quantity,
                    lineTotal = lineTotal,
                    imageUrl = menuItem.imageUrl
                )
            }
        }

        val total = detailedItems.fold(0L) { acc, item -> acc + item.lineTotal }

        return CartDetails(
            customerId = cart.customerId ?: customerId,
            restaurantId = cart.restaurantId,
            items = detailedItems,
            totalPrice = total
        )

    }

}

