package com.nom.api.adapters.`in`.http.controllers.order

import com.nom.api.domain.order.entities.Address
import com.nom.api.domain.order.entities.Order
import com.nom.api.domain.order.entities.OrderStatus
import com.nom.api.domain.order.entities.PaymentMethod
import com.nom.api.domain.order.ports.`in`.CreateOrderCommand
import com.nom.api.domain.order.ports.`in`.CreateOrderUseCase
import com.nom.api.domain.order.ports.`in`.GetOrdersUseCase
import com.nom.api.domain.order.ports.`in`.OrderItemCommand
import com.nom.api.domain.order.ports.`in`.UpdateOrderStatusUseCase
import com.nom.api.domain.ports.out.UserRepository
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/orders")
class OrderController(
    private val createOrderUseCase: CreateOrderUseCase,
    private val updateOrderStatusUseCase: UpdateOrderStatusUseCase,
    private val getOrdersUseCase: GetOrdersUseCase,
    private val userRepository: UserRepository
) {

    @PostMapping
    fun placeOrder(
        @RequestBody request: PlaceOrderRequest,
        @AuthenticationPrincipal email: String?
    ): ResponseEntity<CreateOrderResponse> {
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()

        val user = userRepository.findByEmail(email)
            ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()

        val command = CreateOrderCommand(
            customerId = user.id!!,
            restaurantId = request.restaurantId,
            items = request.items.map { OrderItemCommand(it.menuItemId, it.quantity) },
            deliveryAddress = request.deliveryAddress,
            paymentMethod = request.paymentMethod
        )

        val orderId = createOrderUseCase.createOrder(command)

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(CreateOrderResponse(orderId, "Rendelés sikeresen rögzítve"))
    }

    @PatchMapping("/{id}/status")
    fun updateStatus(
        @PathVariable id: String,
        @RequestBody request: UpdateStatusRequest,
        @AuthenticationPrincipal email: String?
    ): ResponseEntity<Void> {
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()

        val user = userRepository.findByEmail(email)
            ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()

        updateOrderStatusUseCase.updateStatus(
            orderId = id,
            newStatus = request.status,
            userId = user.id!!,
            userRole = user.role.name
        )

        return ResponseEntity.ok().build()
    }

    @GetMapping
    fun getOrders(
        @RequestParam(required = false) status: OrderStatus?,
        @AuthenticationPrincipal email: String?
    ): ResponseEntity<List<Order>> {
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()

        val user = userRepository.findByEmail(email)
            ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()

        val orders = getOrdersUseCase.getOrders(
            userId = user.id!!,
            role = user.role.name,
            status = status
        )

        return ResponseEntity.ok(orders)
    }
}

data class PlaceOrderRequest(
    val restaurantId: String,
    val items: List<OrderItemRequest>,
    val deliveryAddress: Address,
    val paymentMethod: PaymentMethod
)

data class OrderItemRequest(
    val menuItemId: String,
    val quantity: Int
)

data class CreateOrderResponse(
    val orderId: String,
    val message: String
)

data class UpdateStatusRequest(
    val status: OrderStatus
)