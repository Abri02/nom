package com.nom.api.adapters.`in`.http.controllers

import com.nom.api.domain.menu.entities.Menu
import com.nom.api.domain.menu.entities.RestaurantProfile
import com.nom.api.domain.user.entities.UserRole
import com.nom.api.domain.ports.`in`.CreateUserRequest
import com.nom.api.domain.ports.`in`.CreateUserUseCase
import com.nom.api.domain.user.ports.`in`.*
import com.nom.api.security.AuthUser
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*

/**
 * Input Adapter - HTTP Controller for User operations
 */
@RestController
@RequestMapping("/api/users")
class UserController(
    private val createUserUseCase: CreateUserUseCase,
    private val addFavouriteRestaurantUseCase: AddFavouriteRestaurantUseCase,
    private val getFavouriteRestaurantsUseCase: GetFavouriteRestaurantsUseCase,
    private val removeFavouriteRestaurantUseCase: RemoveFavouriteRestaurantUseCase,
    private val updateUserUseCase: UpdateUserUseCase,
    private val isFavouriteUseCase: IsFavouriteUseCase
) {

    @PostMapping
    suspend fun createOrUpdateUser(@AuthenticationPrincipal authUser: AuthUser?,@RequestBody request: CreateUserHttpRequest): ResponseEntity<Any> {
        return try {
            if (request.id != null) {
                val updatedUser = updateUserUseCase.updateUser(
                    UpdateUserRequest(
                        id = request.id,
                        name = request.name,
                        email = request.email,
                        phoneNumber = request.phoneNumber,
                        street = request.street,
                        streetNumber = request.streetNumber,
                        city = request.city,
                        zipCode = request.zipCode,
                        role = request.role
                    )
                )

                val response = UserResponse(
                    id = updatedUser.id,
                    name = updatedUser.name,
                    email = updatedUser.email,
                    phoneNumber = updatedUser.phoneNumber,
                    role = updatedUser.role,
                    createdAt = updatedUser.createdAt.toString()
                )

                return ResponseEntity.ok(response)
            }


            if (request.password == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ErrorResponse("Password is required for new users"))
            }

            if (request.role == UserRole.RESTAURANT && request.restaurantProfile == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ErrorResponse("Restaurant profile is required for RESTAURANT users"))
            }

            val restaurantProfileDomain = request.restaurantProfile?.let {
                RestaurantProfile(
                    restaurantName = it.restaurantName,
                    openingHours = it.openingHours,
                    menu = Menu()
                )
            }

            val createUserRequest = CreateUserRequest(
                name = request.name,
                email = request.email,
                password = request.password,
                phoneNumber = request.phoneNumber,
                role = request.role,
                ZipCode = request.zipCode,
                City = request.city,
                Street = request.street,
                StreetNumber = request.streetNumber,
                restaurantProfile = restaurantProfileDomain
            )

            val user = createUserUseCase.execute(createUserRequest)

            val response = UserResponse(
                id = user.id,
                name = user.name,
                email = user.email,
                phoneNumber = user.phoneNumber,
                role = user.role,
                createdAt = user.createdAt.toString()
            )

            ResponseEntity.status(HttpStatus.CREATED).body(response)
        } catch (e: IllegalArgumentException) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ErrorResponse(e.message ?: "Bad request"))
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ErrorResponse("Internal server error"))
        }
    }

    @PostMapping("/favourites")
    fun addFavouriteRestaurant(
        @AuthenticationPrincipal user: AuthUser?,
        @RequestBody request: AddFavouriteRestaurantRequest
    ): ResponseEntity<Any> {
        val principal = user ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()
        return try {
            addFavouriteRestaurantUseCase.addFavourite(
                restaurantId = request.restaurantId,
                userId = principal.id
            )

            val favourites = getFavouriteRestaurantsUseCase.getFavourites(principal.id)
            ResponseEntity.ok(favourites)


        } catch (e: IllegalArgumentException) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ErrorResponse(e.message ?: "Bad request"))
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ErrorResponse("Internal server error"))
        }
    }

    @GetMapping("/favourites/restaurants")
    fun getFavouriteRestaurants(
        @AuthenticationPrincipal user: AuthUser?
    ): ResponseEntity<List<RestaurantProfile>> {
        val principal = user ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()

        val favourites = getFavouriteRestaurantsUseCase.getFavourites(principal.id)
        return ResponseEntity.ok(favourites)
    }

    @DeleteMapping("/favourites")
    fun removeFavouriteRestaurant(
        @AuthenticationPrincipal user: AuthUser?,
        @RequestBody request: AddFavouriteRestaurantRequest
    ): ResponseEntity<Any> {
        val principal = user ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()

        return try {
            removeFavouriteRestaurantUseCase.removeRestaurant(
                userId = principal.id,
                restaurantId = request.restaurantId,
            )

            val favourites = getFavouriteRestaurantsUseCase.getFavourites(principal.id)

            ResponseEntity.ok(favourites)

        } catch (e: IllegalArgumentException) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ErrorResponse(e.message ?: "Bad request"))
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ErrorResponse("Internal server error"))
        }
    }

    @GetMapping("/favourites")
    fun isFavourite(
        @AuthenticationPrincipal user: AuthUser?,
        @RequestParam restaurantId: String
    ): ResponseEntity<Any> {
        val principal = user ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()

        return try {
            val result = isFavouriteUseCase.isFavourite(
                restaurantId = restaurantId,
                userId = principal.id
            )

            ResponseEntity.ok(IsFavouriteResponse(isFavourite = result))

        } catch (e: IllegalArgumentException) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ErrorResponse(e.message ?: "Bad request"))
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ErrorResponse("Internal server error"))
        }
    }

}

data class CreateUserHttpRequest(
    val id: String?,
    val name: String,
    val email: String,
    val password: String?,
    val phoneNumber: String,
    val zipCode : String,
    val city: String,
    val street: String,
    val streetNumber: String,
    val role: UserRole,
    val restaurantProfile: RestaurantProfileHttpRequest? = null
)

data class RestaurantProfileHttpRequest(
    val restaurantName: String,
    val openingHours: String? = null
)

data class UserResponse(
    val id: String,
    val name: String,
    val email: String,
    val phoneNumber: String,
    val role: UserRole,
    val createdAt: String
)

data class ErrorResponse(
    val message: String
)

data class AddFavouriteRestaurantRequest(
    val restaurantId: String
)

data class IsFavouriteResponse(
    val isFavourite: Boolean
)