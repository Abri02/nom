package com.nom.api.adapters.`in`.http.controllers.admin

import com.nom.api.application.usecases.admin.ManageUsersUseCaseImpl
import com.nom.api.domain.order.entities.Order
import com.nom.api.domain.order.ports.out.OrderRepository // Admin látja az összeset
import com.nom.api.domain.user.entities.User
import com.nom.api.domain.ports.out.UserRepository
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/admin")
class AdminController(
    private val manageUsersUseCase: ManageUsersUseCaseImpl,
    private val orderRepository: OrderRepository, // Admin rendeléskezeléshez
    private val userRepository: UserRepository
) {

    // Segédfüggvény a jogellenőrzéshez
    private fun checkAdminRole(email: String?): Boolean {
        if (email == null) return false
        val user = userRepository.findByEmail(email) ?: return false
        return user.role.name == "ADMIN"
    }

    // 1. Felhasználók listázása
    @GetMapping("/users")
    fun getAllUsers(@AuthenticationPrincipal email: String?): ResponseEntity<List<User>> {
        if (!checkAdminRole(email)) return ResponseEntity.status(HttpStatus.FORBIDDEN).build()

        return ResponseEntity.ok(manageUsersUseCase.getAllUsers())
    }

    // 2. Felhasználó felfüggesztése (PATCH /api/admin/users/{id}?suspend=true)
    @PatchMapping("/users/{id}")
    fun suspendUser(
        @PathVariable id: String,
        @RequestParam suspend: Boolean,
        @AuthenticationPrincipal email: String?
    ): ResponseEntity<Void> {
        if (!checkAdminRole(email)) return ResponseEntity.status(HttpStatus.FORBIDDEN).build()

        manageUsersUseCase.toggleUserSuspension(id, suspend)
        return ResponseEntity.ok().build()
    }

    // 3. Összes rendelés megtekintése [cite: 218-222]
    @GetMapping("/orders")
    fun getAllOrders(@AuthenticationPrincipal email: String?): ResponseEntity<List<Order>> {
        if (!checkAdminRole(email)) return ResponseEntity.status(HttpStatus.FORBIDDEN).build()

        // Itt feltételezzük, hogy az OrderPersistenceAdapter-ben megírtad a findAll()-t
        // (A múltkor beletettük: fun findAll(): List<Order>)
        return ResponseEntity.ok(orderRepository.findAll()) // Ez a metódus kell az OrderRepository-ba!
    }
}