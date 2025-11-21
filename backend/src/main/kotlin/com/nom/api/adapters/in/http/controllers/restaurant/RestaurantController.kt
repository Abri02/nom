package com.nom.api.adapters.`in`.http.controllers.restaurant

import com.nom.api.domain.restaurant.ports.`in`.GetRestaurantsUseCase
import com.nom.api.domain.user.entities.User
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/restaurants")
class RestaurantController(
    private val getRestaurantsUseCase: GetRestaurantsUseCase
) {

    @GetMapping
    suspend fun getRestaurants(
        @RequestParam(required = false) cuisine: String?
    ): ResponseEntity<List<User>> {
        val restaurants = getRestaurantsUseCase.getRestaurants(cuisine)
        return ResponseEntity.ok(restaurants)
    }
}