package com.nom.api.adapters.`in`.http.controllers.menu

import com.nom.api.domain.menu.entities.Menu
import com.nom.api.domain.menu.entities.MenuItem
import com.nom.api.domain.menu.entities.RestaurantProfile
import com.nom.api.domain.menu.ports.`in`.*
import kotlinx.coroutines.runBlocking
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/restaurants")
class MenuController(
    private val getRestaurantProfileUseCase: GetRestaurantProfileUseCase,
    private val updateRestaurantProfileUseCase: UpdateRestaurantProfileUseCase,
    private val getMenuUseCase: GetMenuUseCase,
    private val addMenuItemUseCase: AddMenuItemUseCase,
    private val updateMenuItemUseCase: UpdateMenuItemUseCase,
    private val deleteMenuItemUseCase: DeleteMenuItemUseCase,
    private val getAllRestaurantUseCase: GetAllRestaurantUseCase
) {

    // --------- Restaurant profile ---------

    @GetMapping("/restaurants")
    fun getAllRestaurants(
    ): ResponseEntity<List<RestaurantProfileResponse>> = runBlocking {
        return@runBlocking try {

            val profile = getAllRestaurantUseCase.execute()

            println(">>> profile FOUND, returning 200")
            ResponseEntity.ok(profile.map { it.toResponse() })
        } catch (e: Exception) {
            e.printStackTrace()
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()
        }
    }

    @GetMapping("/{restaurantId}/profile")
    fun getRestaurantProfile(
        @PathVariable restaurantId: String
    ): ResponseEntity<RestaurantProfileResponse> = runBlocking {
        return@runBlocking try {
            println(">>> getRestaurantProfile called with restaurantId=$restaurantId")

            val profile = getRestaurantProfileUseCase.execute(restaurantId)
                ?: run {
                    println(">>> profile not found, returning 404")
                    return@runBlocking ResponseEntity.notFound().build()
                }

            println(">>> profile FOUND, returning 200")
            ResponseEntity.ok(profile.toResponse())
        } catch (e: Exception) {
            e.printStackTrace()
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()
        }
    }

    @PutMapping("/{restaurantId}/profile")
    fun updateRestaurantProfile(
        @PathVariable restaurantId: String,
        @RequestBody request: UpdateRestaurantProfileHttpRequest
    ): ResponseEntity<RestaurantProfileResponse> = runBlocking {
        return@runBlocking try {
            val useCaseRequest = UpdateRestaurantProfileRequest(
                restaurantId = restaurantId,
                restaurantName = request.restaurantName,
                openingHours = request.openingHours
            )

            val updated = updateRestaurantProfileUseCase.execute(useCaseRequest)
            ResponseEntity.ok(updated.toResponse())
        } catch (e: IllegalArgumentException) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST).build()
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()
        }
    }

    // --------- Menu ---------

    @GetMapping("/{restaurantId}/menu")
    fun getMenu(
        @PathVariable restaurantId: String
    ): ResponseEntity<MenuResponse> = runBlocking {
        return@runBlocking try {
            val menu = getMenuUseCase.execute(restaurantId)
                ?: Menu() // ha nincs menü, visszaadhatunk üreset

            ResponseEntity.ok(menu.toResponse())
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()
        }
    }

    @PostMapping("/{restaurantId}/menu/items")
    fun addMenuItem(
        @PathVariable restaurantId: String,
        @RequestBody request: CreateMenuItemHttpRequest
    ): ResponseEntity<MenuItemResponse> = runBlocking {
        return@runBlocking try {
            val useCaseRequest = AddMenuItemRequest(
                restaurantId = restaurantId,
                name = request.name,
                description = request.description,
                price = request.price,
                allergens = request.allergens,
                imageUrl = request.imageUrl
            )

            val item = addMenuItemUseCase.execute(useCaseRequest)
            ResponseEntity.status(HttpStatus.CREATED).body(item.toResponse())
        } catch (e: IllegalArgumentException) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST).build()
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()
        }
    }

    @PutMapping("/{restaurantId}/menu/items/{menuItemId}")
    fun updateMenuItem(
        @PathVariable restaurantId: String,
        @PathVariable menuItemId: String,
        @RequestBody request: UpdateMenuItemHttpRequest
    ): ResponseEntity<MenuItemResponse> = runBlocking {
        return@runBlocking try {
            val useCaseRequest = UpdateMenuItemRequest(
                restaurantId = restaurantId,
                menuItemId = menuItemId,
                name = request.name,
                description = request.description,
                price = request.price,
                allergens = request.allergens,
                imageUrl = request.imageUrl
            )

            val updated = updateMenuItemUseCase.execute(useCaseRequest)
            ResponseEntity.ok(updated.toResponse())
        } catch (e: IllegalArgumentException) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST).build()
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()
        }
    }

    @DeleteMapping("/{restaurantId}/menu/items/{menuItemId}")
    fun deleteMenuItem(
        @PathVariable restaurantId: String,
        @PathVariable menuItemId: String
    ): ResponseEntity<Void> = runBlocking {
        return@runBlocking try {
            val deleted = deleteMenuItemUseCase.execute(restaurantId, menuItemId)
            if (deleted) {
                ResponseEntity.noContent().build()
            } else {
                ResponseEntity.notFound().build()
            }
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()
        }
    }

    // --------- Mapping függvények ---------

    private fun RestaurantProfile.toResponse(): RestaurantProfileResponse =
        RestaurantProfileResponse(
            restaurantName = restaurantName,
            openingHours = openingHours,
            menu = menu.toResponse()
        )

    private fun Menu.toResponse(): MenuResponse =
        MenuResponse(
            items = menuItems.map { it.toResponse() }
        )

    private fun MenuItem.toResponse(): MenuItemResponse =
        MenuItemResponse(
            id = id,
            name = name,
            description = description,
            price = price,
            allergens = allergens,
            imageUrl = imageUrl
        )
}

// --------- HTTP DTO-k ---------

data class UpdateRestaurantProfileHttpRequest(
    val restaurantName: String,
    val openingHours: String
)

data class RestaurantProfileResponse(
    val restaurantName: String,
    val openingHours: String? = null,
    val menu: MenuResponse
)

data class MenuResponse(
    val items: List<MenuItemResponse>
)

data class CreateMenuItemHttpRequest(
    val name: String,
    val description: String? = null,
    val price: Long,
    val allergens: List<String> = emptyList(),
    val imageUrl: String? = null
)

data class UpdateMenuItemHttpRequest(
    val name: String,
    val description: String? = null,
    val price: Long,
    val allergens: List<String> = emptyList(),
    val imageUrl: String? = null
)

data class MenuItemResponse(
    val id: String,
    val name: String,
    val description: String?,
    val price: Long,
    val allergens: List<String>,
    val imageUrl: String?
)