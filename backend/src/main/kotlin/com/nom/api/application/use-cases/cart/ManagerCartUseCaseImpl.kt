package com.nom.api.application.usecases.cart

import com.nom.api.domain.cart.entities.Cart
import com.nom.api.domain.cart.entities.CartItem
import com.nom.api.domain.cart.ports.`in`.AddItemCommand
import com.nom.api.domain.cart.ports.`in`.ManageCartUseCase
import com.nom.api.domain.cart.ports.out.CartRepository
import com.nom.api.domain.menu.ports.out.MenuRepository // Biztosítsd, hogy ez létezik
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ManageCartUseCaseImpl(
    private val cartRepository: CartRepository,
    private val menuRepository: MenuRepository
) : ManageCartUseCase {

    override fun getCart(customerId: String): Cart {
        return cartRepository.findByCustomerId(customerId)
            ?: Cart(customerId = customerId)
    }

    @Transactional
    override fun addItem(customerId: String, command: AddItemCommand) {
        var cart = cartRepository.findByCustomerId(customerId)
            ?: Cart(customerId = customerId)

        if (cart.restaurantId != null && cart.restaurantId != command.restaurantId) {
            cart.items.clear()
            cart.restaurantId = command.restaurantId
        } else {
            cart.restaurantId = command.restaurantId
        }

        val menu = menuRepository.findByRestaurantId(command.restaurantId)
            ?: throw IllegalArgumentException("Étterem nem található")

        val menuItem = menu.menuItems.find { it.id == command.menuItemId }
            ?: throw IllegalArgumentException("Étel nem található")

        val existingItem = cart.items.find { it.menuItemId == command.menuItemId }
        if (existingItem != null) {
            existingItem.quantity += command.quantity
        } else {
            cart.items.add(
                CartItem(
                    menuItemId = menuItem.id,
                    name = menuItem.name,
                    price = menuItem.price,
                    quantity = command.quantity
                )
            )
        }

        cart.calculateTotal()
        cartRepository.save(cart)
    }

    @Transactional
    override fun removeItem(customerId: String, menuItemId: String) {
        val cart = cartRepository.findByCustomerId(customerId) ?: return

        cart.items.removeIf { it.menuItemId == menuItemId }

        if (cart.items.isEmpty()) {
            cart.restaurantId = null
        }

        cart.calculateTotal()
        cartRepository.save(cart)
    }

    @Transactional
    override fun clearCart(customerId: String) {
        cartRepository.deleteByCustomerId(customerId)
    }
}