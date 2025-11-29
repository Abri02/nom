package com.nom.api.adapters.`in`.http.controllers.order

import com.nom.api.application.`use-cases`.order.GetOrderByRestaurantAndStatusUseCaseImpl
import com.nom.api.application.usecases.order.GetOrderByUserUseCaseImpl
import com.nom.api.domain.order.entities.Address
import com.nom.api.domain.order.entities.Order
import com.nom.api.domain.order.entities.OrderStatus
import com.nom.api.domain.order.entities.PaymentMethod
import com.nom.api.domain.order.ports.`in`.*
import com.nom.api.domain.ports.out.UserRepository
import com.nom.api.security.AuthUser
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/orders")
class OrderController(
    private val createOrderUseCase: CreateOrderUseCase,
    private val getOrderByIdUseCase: GetOrderByIdUseCase,
    private val getOrderByUserUseCaseImpl: GetOrderByUserUseCaseImpl,
    private val getOrderByRestaurantAndStatusUseCase: GetOrderByRestaurantAndStatusUseCase,
    private val getOrderByCourierIdUseCase: GetOrderByCourierIdUseCase,
    private val acceptOrderByRestaurantUseCase: AcceptOrderByRestaurantUseCase,
    private val declineOrderByRestaurantUseCase: DeclineOrderByRestaurantUseCase,
    private val prepareOrderByRestaurantUseCase: PrepareOrderByRestaurantUseCase,
    private val startDeliveryByCourierUseCase: StartDeliveryByCourierUseCase,
    private val finishDeliveryByCourierUseCase: FinishDeliveryByCourierUseCase,
) {

    @PostMapping
    fun placeOrder(
        @AuthenticationPrincipal user: AuthUser?
    ): ResponseEntity<OrderDetail> {
        val principal = user ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()

        val orderDetail = createOrderUseCase.createOrder(principal.id)

        return ResponseEntity.status(HttpStatus.CREATED).body(orderDetail)
    }

    @GetMapping("/{orderId}")
    fun getOrderById(
        @PathVariable orderId: String
    ): ResponseEntity<OrderDetail> {
        val order = getOrderByIdUseCase.getOrderById(orderId)
            ?: return ResponseEntity.notFound().build()

        return ResponseEntity.ok(order)
    }

    @GetMapping("/me")
    fun getCustomerOrder(
        @AuthenticationPrincipal user: AuthUser?
    ): ResponseEntity<OrderDetail> {
        val principal = user ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()

        val order = getOrderByUserUseCaseImpl.getOrder(principal.id)
            ?: return ResponseEntity.notFound().build()

        return ResponseEntity.ok(order)
    }

    @GetMapping("/restaurant")
    fun getOrdersForRestaurantByStatus(
        @AuthenticationPrincipal user: AuthUser?,
        @RequestBody request: OrderStatusRequest
    ): ResponseEntity<List<OrderDetail>> {
        val principal = user ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()

        // Feltételezzük, hogy principal.id = restaurantId
        val orders = getOrderByRestaurantAndStatusUseCase.getOrder(principal.id, request.orderStatus)
        return ResponseEntity.ok(orders)
    }

    @GetMapping("/courier/me")
    fun getOrdersForCourier(
        @AuthenticationPrincipal user: AuthUser?
    ): ResponseEntity<List<OrderDetail>> {
        val principal = user ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()

        // principal.id = courierId
        val orders = getOrderByCourierIdUseCase.getOrder(principal.id)
        return ResponseEntity.ok(orders)
    }

    @PostMapping("/accept")
    fun acceptOrder(
        @AuthenticationPrincipal user: AuthUser?,
        @RequestBody request: OrderIdRequest
    ): ResponseEntity<OrderDetail> {
        val principal = user ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()

        val order = acceptOrderByRestaurantUseCase.acceptOrder(request.orderId, principal.id)
            ?: return ResponseEntity.notFound().build()

        return ResponseEntity.ok(order)
    }

    @PostMapping("/decline")
    fun declineOrder(
        @AuthenticationPrincipal user: AuthUser?,
        @RequestBody request: OrderIdRequest
    ): ResponseEntity<OrderDetail> {
        val principal = user ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()

        val order = declineOrderByRestaurantUseCase.declineOrder(request.orderId, principal.id)
            ?: return ResponseEntity.notFound().build()

        return ResponseEntity.ok(order)
    }

    @PostMapping("/prepare")
    fun prepareOrder(
        @AuthenticationPrincipal user: AuthUser?,
        @RequestBody request: OrderIdRequest
    ): ResponseEntity<OrderDetail> {
        val principal = user ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()

        val order = prepareOrderByRestaurantUseCase.prepareOrder(request.orderId, principal.id)
            ?: return ResponseEntity.notFound().build()

        return ResponseEntity.ok(order)
    }

    @PostMapping("/start-delivery")
    fun startDelivery(
        @AuthenticationPrincipal user: AuthUser?,
        @RequestBody request: OrderIdRequest
    ): ResponseEntity<OrderDetail> {
        val principal = user ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()

        val order = startDeliveryByCourierUseCase.startDelivery(request.orderId, principal.id)
            ?: return ResponseEntity.notFound().build()

        return ResponseEntity.ok(order)
    }

    @PostMapping("/finish-delivery")
    fun finishDelivery(
        @AuthenticationPrincipal user: AuthUser?,
        @RequestBody request: OrderIdRequest
    ): ResponseEntity<OrderDetail> {
        val principal = user ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()

        val order = finishDeliveryByCourierUseCase.finishDelivery(request.orderId, principal.id)
            ?: return ResponseEntity.notFound().build()

        return ResponseEntity.ok(order)
    }


}

data class OrderIdRequest(
    val orderId: String
)

data class OrderStatusRequest(
    val orderStatus: OrderStatus
)