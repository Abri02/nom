package com.nom.api.adapters.`in`.http.controllers.cart

import com.nom.api.domain.cart.entities.Cart
import com.nom.api.domain.cart.ports.`in`.AddItemCommand
import com.nom.api.domain.cart.ports.`in`.ManageCartUseCase
import com.nom.api.domain.ports.out.UserRepository
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/cart")
class CartController(
    private val manageCartUseCase: ManageCartUseCase,
    private val userRepository: UserRepository
) {

    @GetMapping
    fun getCart(@AuthenticationPrincipal email: String?): ResponseEntity<Cart> {
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()

        val user = userRepository.findByEmail(email)
            ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()

        val cart = manageCartUseCase.getCart(user.id!!)
        return ResponseEntity.ok(cart)
    }

    @PostMapping("/items")
    fun addItem(
        @AuthenticationPrincipal email: String?,
        @RequestBody request: AddCartItemRequest
    ): ResponseEntity<Void> {
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()

        val user = userRepository.findByEmail(email)
            ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()

        manageCartUseCase.addItem(
            user.id!!,
            AddItemCommand(request.restaurantId, request.menuItemId, request.quantity)
        )
        return ResponseEntity.ok().build()
    }

    @DeleteMapping("/items/{itemId}")
    fun removeItem(
        @AuthenticationPrincipal email: String?,
        @PathVariable itemId: String
    ): ResponseEntity<Void> {
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()

        val user = userRepository.findByEmail(email)
            ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()

        manageCartUseCase.removeItem(user.id!!, itemId)
        return ResponseEntity.ok().build()
    }
}

data class AddCartItemRequest(
    val restaurantId: String,
    val menuItemId: String,
    val quantity: Int
)