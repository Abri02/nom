package com.nom.api.adapters.out.persistence.mongodb.cart

import com.mongodb.client.MongoCollection
import com.mongodb.client.model.Filters.eq
import com.mongodb.client.model.Updates.set
import com.mongodb.client.model.Updates.unset
import com.nom.api.domain.cart.entities.Cart
import com.nom.api.domain.cart.entities.CartItem
import com.nom.api.domain.cart.ports.out.CartRepository
import org.bson.Document
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Repository

@Repository
class MongoCartRepository(@Qualifier("usersCollection") private val collection: MongoCollection<Document>) : CartRepository {
    override fun findByCustomerId(customerId: String): Cart? {
        val userDoc = collection.find(eq("_id", customerId)).firstOrNull() ?: return null

        val cartDoc = userDoc.get("cart", Document::class.java) ?: return null

        return documentToCart(cartDoc)
    }

    override fun createCart(customerId: String): Cart {
        val newCart = Cart(
            id = null,
            customerId = customerId,
            restaurantId = null,
            items = mutableListOf(),
            totalPrice = 0L
        )

        val cartDoc = cartToDocument(newCart)

        collection.updateOne(
            eq("_id", customerId),
            set("cart", cartDoc)
        )

        return newCart
    }

    override fun deleteByCustomerId(customerId: String) {
        collection.updateOne(
            eq("_id", customerId),
            unset("cart")
        )
    }

    override fun addItemToCart(customerId: String, cartItem: CartItem): Cart {
        val userDoc = collection.find(eq("_id", customerId)).firstOrNull()
            ?: throw IllegalArgumentException("User not found: $customerId")

        val cartDoc = userDoc.get("cart", Document::class.java)
            ?: cartToDocument(
                Cart(
                    id = null,
                    customerId = customerId,
                    restaurantId = cartItem.restaurantId,
                    items = mutableListOf(),
                    totalPrice = 0L
                )
            )

        val itemsList = (cartDoc["items"] as? List<Document>)?.toMutableList() ?: mutableListOf()

        val existing = itemsList.firstOrNull {
            it.getString("restaurantId") == cartItem.restaurantId &&
                    it.getString("menuItemId") == cartItem.menuItemId
        }

        if (existing != null) {
            val currentQty = existing.getInteger("quantity") ?: 0
            existing["quantity"] = currentQty + cartItem.quantity
        } else {
            val newItemDoc = Document()
                .append("restaurantId", cartItem.restaurantId)
                .append("menuItemId", cartItem.menuItemId)
                .append("quantity", cartItem.quantity)

            itemsList.add(newItemDoc)
        }

        cartDoc["items"] = itemsList
        cartDoc["restaurantId"] = cartItem.restaurantId

        collection.updateOne(
            eq("_id", customerId),
            set("cart", cartDoc)
        )

        return documentToCart(cartDoc)
    }

    override fun deleteItemFromCart(customerId: String, menuItemId: String): Cart {
        val userDoc = collection.find(eq("_id", customerId)).firstOrNull()
            ?: throw IllegalArgumentException("User not found: $customerId")

        val cartDoc = userDoc.get("cart", Document::class.java)
            ?: return Cart(
                customerId = customerId,
                restaurantId = null,
                items = mutableListOf(),
                totalPrice = 0L
            )

        val itemsList = (cartDoc["items"] as? List<Document>)?.toMutableList() ?: mutableListOf()

        val newItems = itemsList.filterNot { it.getString("menuItemId") == menuItemId }.toMutableList()
        cartDoc["items"] = newItems

        if (newItems.isEmpty()) {
            cartDoc["restaurantId"] = null
        }

        collection.updateOne(
            eq("_id", customerId),
            set("cart", cartDoc)
        )

        return documentToCart(cartDoc)
    }

    private fun documentToCart(doc: Document): Cart {

        val customerId = doc.getString("customerId")
        val restaurantId = doc.getString("restaurantId")
        val totalPrice = (doc.get("totalPrice") as? Number)?.toLong() ?: 0L

        val itemsDocs = doc.getList("items", Document::class.java) ?: emptyList()

        val items = itemsDocs.map { itemDoc ->
            CartItem(
                restaurantId = itemDoc.getString("restaurantId"),
                menuItemId = itemDoc.getString("menuItemId"),
                quantity = itemDoc.getInteger("quantity") ?: 0,

            )
        }.toMutableList()

        return Cart(
            id = doc.getString("id"),
            customerId = customerId,
            restaurantId = restaurantId,
            items = items,
            totalPrice = totalPrice
        )
    }

    private fun cartToDocument(cart: Cart): Document {
        val doc = Document()

        cart.id?.let { doc.append("id", it) }
        doc.append("customerId", cart.customerId)
        doc.append("restaurantId", cart.restaurantId)
        doc.append("totalPrice", cart.totalPrice)

        val itemsDocs = cart.items.map { item ->
            Document()
                .append("restaurantId", item.restaurantId)
                .append("menuItemId", item.menuItemId)
                .append("quantity", item.quantity)
        }

        doc.append("items", itemsDocs)

        return doc
    }
}