package com.nom.api.adapters.`in`.http.controllers.cart

import com.nom.api.application.`use-cases`.cart.RemoveItemFromCartUseCaseImpl
import com.nom.api.domain.cart.ports.`in`.*
import com.nom.api.security.AuthUser
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/cart")
class CartController(
    private val addItemToCartUseCase: AddItemToCartUseCase,
    private val clearCartUseCase: ClearCartUseCase,
    private val getCartUseCase: GetCartUseCase,
    private val removeItemFromCartUseCase: RemoveItemFromCartUseCase,
    private val updateCartUseCase: UpdateCartUseCase,
) {

    @GetMapping
    fun getCart(
        @AuthenticationPrincipal user: AuthUser?
    ): ResponseEntity<CartDetails> {
        val principal = user ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()

        val customerId = principal.id
        val cart = getCartUseCase.getCart(customerId)
        return ResponseEntity.ok(cart)
    }

    @PostMapping("/items")
    fun addItemToCart(
        @AuthenticationPrincipal user: AuthUser?,
        @RequestBody request: AddItemRequest
    ): ResponseEntity<CartDetails> {
        val principal = user ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()
        val customerId = principal.id

        val updatedCart = addItemToCartUseCase.addItem(customerId, request)
        return ResponseEntity.status(HttpStatus.OK).body(updatedCart)
    }

    @DeleteMapping
    fun clearCart(
        @AuthenticationPrincipal user: AuthUser?
    ): ResponseEntity<CartDetails> {
        val principal = user ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()
        val customerId = principal.id

        val clearedCart = clearCartUseCase.clearCart(customerId)
        return ResponseEntity.ok(clearedCart)
    }

    @DeleteMapping("/items/{menuItemId}")
    fun removeItem(
        @AuthenticationPrincipal user: AuthUser?,
        @PathVariable menuItemId: String
    ): ResponseEntity<CartDetails> {
        val principal = user ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()
        val customerId = principal.id

        val updatedCart = removeItemFromCartUseCase.removeItem(customerId, menuItemId)
        return ResponseEntity.ok(updatedCart)
    }

    @PutMapping("/items")
    fun updateCart(
        @AuthenticationPrincipal user: AuthUser?,
        @RequestBody items: List<AddItemRequest>
    ): ResponseEntity<CartDetails> {
        val principal = user ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()
        val updatedCart = updateCartUseCase.updateCart(principal.id, items)
        return ResponseEntity.ok(updatedCart)
    }



}

@ResponseStatus(HttpStatus.UNAUTHORIZED)
class UnauthenticatedException(message: String) : RuntimeException(message)