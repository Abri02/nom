package com.nom.api.adapters.out.persistence.mongodb

import com.mongodb.client.MongoCollection
import com.mongodb.client.model.Filters
import com.nom.api.domain.cart.entities.Cart
import com.nom.api.domain.cart.entities.CartItem
import com.nom.api.domain.ports.out.UserRepository
import com.nom.api.domain.user.entities.User
import com.nom.api.domain.user.entities.UserRole
import org.bson.Document
import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneId

/**
 * MongoDB implementation of UserRepository (Output Adapter)
 */
class MongoUserRepository(
    private val collection: MongoCollection<Document>
) : UserRepository {

    override fun save(user: User): User {
        val document = userToDocument(user)
        collection.insertOne(document)
        return user
    }

    override fun findById(id: String): User? {
        val document = collection.find(Filters.eq("_id", id)).firstOrNull()
        return document?.let { documentToUser(it) }
    }

    override fun findByEmail(email: String): User? {
        val document = collection.find(Filters.eq("email", email)).firstOrNull()
        return document?.let { documentToUser(it) }
    }

    override fun findAll(): List<User> {
        return collection.find().toList().map { documentToUser(it) }
    }

    override suspend fun update(user: User): User {
        val document = userToDocument(user)
        collection.replaceOne(Filters.eq("_id", user.id), document)
        return user
    }

    override suspend fun delete(id: String): Boolean {
        val result = collection.deleteOne(Filters.eq("_id", id))
        return result.deletedCount > 0
    }

    override suspend fun findAllRestaurants(cuisineType: String?): List<User> {
        return collection.find(Filters.eq("role", UserRole.RESTAURANT.name)).toList().map { documentToUser(it) }
    }

    

    // Mapping functions

    private fun userToDocument(user: User): Document {
        val doc = Document()
            .append("_id", user.id)
            .append("name", user.name)
            .append("email", user.email)
            .append("passwordHash", user.passwordHash)
            .append("phoneNumber", user.phoneNumber)
            .append("role", user.role.name)
            .append("createdAt", user.createdAt.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli())

        return doc
    }

    private fun documentToUser(doc: Document): User {
        val id = doc.getString("_id")

        val cartDoc = doc.get("cart", Document::class.java)
        val cart = if (cartDoc != null) {
            documentToCart(cartDoc, id)
        } else {
            // ha nincs cart a usernél, csinálunk egy üreset
            Cart(
                customerId = id,
                restaurantId = null,
                items = mutableListOf(),
                totalPrice = 0L
            )
        }

        return User(
            id = doc.getString("_id"),
            name = doc.getString("name"),
            email = doc.getString("email"),
            passwordHash = doc.getString("passwordHash"),
            phoneNumber = doc.getString("phoneNumber"),
            role = UserRole.valueOf(doc.getString("role")),
            createdAt = LocalDateTime.ofInstant(
                Instant.ofEpochMilli(doc.getLong("createdAt")),
                ZoneId.systemDefault()
            ),
            cart = cart
        )
    }

    private fun documentToCart(cartDoc: Document, fallbackCustomerId: String? = null): Cart {
        val customerId = cartDoc.getString("customerId") ?: fallbackCustomerId
        val restaurantId = cartDoc.getString("restaurantId")
        val totalPrice = (cartDoc.get("totalPrice") as? Number)?.toLong() ?: 0L

        val itemsDocs = cartDoc.getList("items", Document::class.java) ?: emptyList()

        val items = itemsDocs.map { itemDoc ->
            CartItem(
                restaurantId = itemDoc.getString("restaurantId"),
                menuItemId = itemDoc.getString("menuItemId"),
                quantity = itemDoc.getInteger("quantity") ?: 0
            )
        }.toMutableList()

        return Cart(
            id = cartDoc.getString("id"),
            customerId = customerId,
            restaurantId = restaurantId,
            items = items,
            totalPrice = totalPrice
        )
    }
}
