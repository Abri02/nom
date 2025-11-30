package com.nom.api.adapters.`in`.http.controllers.admin

import com.nom.api.application.usecases.admin.ManageUsersUseCaseImpl
import com.nom.api.domain.order.entities.Order
import com.nom.api.domain.order.ports.`in`.CancellOrderByAdminUseCase
import com.nom.api.domain.order.ports.`in`.GetAllOrderUseCase
import com.nom.api.domain.order.ports.`in`.OrderDetail
import com.nom.api.domain.order.ports.`in`.UpdateOrderByAdminUseCase
import com.nom.api.domain.order.ports.out.OrderRepository // Admin látja az összeset
import com.nom.api.domain.user.entities.User
import com.nom.api.domain.ports.out.UserRepository
import com.nom.api.security.AuthUser
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/admin")
class AdminController(
    private val manageUsersUseCase: ManageUsersUseCaseImpl,
    private val getAllOrderUseCase: GetAllOrderUseCase,
    private val cancellOrderUseCase: CancellOrderByAdminUseCase,
    private val updateOrderByAdminUseCase: UpdateOrderByAdminUseCase,
) {


    // 1. Felhasználók listázása
    @GetMapping("/users")
    fun getAllUsers(@AuthenticationPrincipal email: String?): ResponseEntity<List<User>> {

        return ResponseEntity.ok(manageUsersUseCase.getAllUsers())
    }


    // 3. Összes rendelés megtekintése [cite: 218-222]
    @GetMapping("/orders")
    fun getAllOrders(@AuthenticationPrincipal user: AuthUser?): ResponseEntity<List<OrderDetail>>  {
        val principal = user ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()

        val orders = getAllOrderUseCase.getAllOrder(principal.id)

        return ResponseEntity.ok(orders)
    }

    @DeleteMapping("/orders")
    fun cancellOrder(
        @AuthenticationPrincipal user: AuthUser?,
        @RequestParam orderId: String)
        : ResponseEntity<Void>{
        val principal = user ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()

        cancellOrderUseCase.cancelOrderByAdmin(orderId, principal.id)

        return ResponseEntity.noContent().build()
    }

    @PutMapping("/orders")
    fun updateOrderByAdmin(
        @AuthenticationPrincipal user: AuthUser?,
        @RequestBody request: OrderDetail
    ): ResponseEntity<OrderDetail> {
        val principal = user ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()

        val updated = updateOrderByAdminUseCase.updateOrder(request, principal.id)

        return ResponseEntity.ok(updated)
    }
}