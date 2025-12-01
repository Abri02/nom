package com.nom.api.adapters.out.persistence.mongodb.order

import com.mongodb.client.MongoCollection
import com.mongodb.client.model.Filters
import com.nom.api.domain.cart.entities.Cart
import com.nom.api.domain.cart.entities.CartItem
import com.nom.api.domain.order.entities.Address
import com.nom.api.domain.order.entities.GeoPoint
import com.nom.api.domain.order.entities.Order
import com.nom.api.domain.order.entities.OrderStatus
import com.nom.api.domain.order.ports.out.OrderRepository
import org.bson.Document
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Repository
import java.time.LocalDateTime
import java.util.*

@Repository
class MongoOrderRepository(@Qualifier("orderCollection") private val collection: MongoCollection<Document>): OrderRepository {
    override fun save(order: Order): Order {
        val doc = orderToDocument(order)

        val existing = collection.find(Filters.eq("_id", order.id)).firstOrNull()

        if (existing == null) {
            collection.insertOne(doc)
        } else {
            collection.replaceOne(Filters.eq("_id", order.id), doc)
        }

        return order
    }

    override fun findById(orderId: String): Order? {
        val doc = collection.find(Filters.eq("_id", orderId)).firstOrNull()
        return doc?.let { documentToOrder(it) }
    }

    override fun findAllByRestaurantId(restaurantId: String): List<Order> {
        return collection.find(Filters.eq("restaurantId", restaurantId))
            .map { documentToOrder(it) }
            .toList()
    }

    override fun findAllByRestaurantIdAndStatus(
        restaurantId: String,
        status: OrderStatus
    ): List<Order> {
        val filter = Filters.and(
            Filters.eq("restaurantId", restaurantId),
            Filters.eq("status", status.name)
        )

        return collection.find(filter)
            .map { documentToOrder(it) }
            .toList()
    }

    override fun findByCustomerId(customerId: String): Order? {
        val activeStatuses = listOf(
            OrderStatus.NEW,
            OrderStatus.PREPARING,
            OrderStatus.READY,
            OrderStatus.ON_DELIVERY
        ).map { it.name }

        val filter = Filters.and(
            Filters.eq("customerId", customerId),
            Filters.`in`("status", activeStatuses)
        )

        val doc = collection.find(filter).firstOrNull()
        return doc?.let { documentToOrder(it) }
    }

    override fun findAllByCustomerId(customerId: String): List<Order> {
        return collection.find(Filters.eq("customerId", customerId))
            .map { documentToOrder(it) }
            .toList()
    }

    override fun findAllByCourierId(courierId: String): List<Order> {
        return collection.find(Filters.eq("courierId", courierId))
            .map { documentToOrder(it) }
            .toList()
    }

    override fun findAllByStatus(status: OrderStatus): List<Order> {
        return collection.find(Filters.eq("status", status.name))
            .map { documentToOrder(it) }
            .toList()
    }

    override fun findAll(): List<Order> {
        return collection.find()
            .map { documentToOrder(it) }
            .toList()
    }

    private fun orderToDocument(order: Order): Document {

        val doc = Document()
            .append("_id", order.id)
            .append("customerId", order.customerId)
            .append("restaurantId", order.restaurantId)
            .append("courierId", order.courierId)
//            .append("deliveryAddress", addressToDocument(order.deliveryAddress))
            .append("currentLocation", order.currentLocation?.let { geoPointToDocument(it) })
            .append("totalPrice", order.totalPrice)
            .append("status", order.status.name)
            .append("createdAt", order.createdAt.toString())

        order.cart?.let { cart ->
            doc.append("cart", cartToDocument(cart))
        }

        return doc
    }

    private fun addressToDocument(address: Address): Document =
        Document()
            .append("street", address.street)
            .append("city", address.city)
            .append("zipCode", address.postalCode)

    private fun geoPointToDocument(point: GeoPoint): Document =
        Document()
            .append("lat", point.latitude)
            .append("lon", point.longitude)

    private fun cartToDocument(cart: Cart): Document {
        val itemsDocs = cart.items.map { cartItemToDocument(it) }

        return Document()
            .append("id", cart.id)
            .append("customerId", cart.customerId)
            .append("restaurantId", cart.restaurantId)
            .append("totalPrice", cart.totalPrice)
            .append("items", itemsDocs)
    }

    private fun cartItemToDocument(item: CartItem): Document =
        Document()
            .append("restaurantId", item.restaurantId)
            .append("menuItemId", item.menuItemId)
            .append("quantity", item.quantity)


    private fun documentToOrder(doc: Document): Order {
        val id = doc.getString("_id") ?: doc.getString("id")
        val customerId = doc.getString("customerId")
        val restaurantId = doc.getString("restaurantId")
        val courierId = doc.getString("courierId")

        val totalPrice = (doc.get("totalPrice") as? Number)?.toLong() ?: 0L

        val statusString = doc.getString("status")
        val status = try {
            OrderStatus.valueOf(statusString)
        } catch (_: Exception) {
            OrderStatus.NEW
        }

        val createdAtString = doc.getString("createdAt")
        val createdAt = try {
            LocalDateTime.parse(createdAtString)
        } catch (_: Exception) {
            LocalDateTime.now()
        }

        val currentLocationDoc = doc.get("currentLocation", Document::class.java)
        val currentLocation = currentLocationDoc?.let { documentToGeoPoint(it) }

        val cartDoc = doc.get("cart", Document::class.java)
        val cart = cartDoc.let { documentToCart(it, customerId) }

        return Order(
            id = id,
            customerId = customerId,
            restaurantId = restaurantId,
            courierId = courierId,
            cart = cart,
            deliveryAddress = null,
            currentLocation = currentLocation,
            totalPrice = totalPrice,
            status = status,
            createdAt = createdAt
        )
    }

    private fun documentToGeoPoint(doc: Document): GeoPoint =
        GeoPoint(
            latitude = (doc.get("lat") as? Number)?.toDouble() ?: 0.0,
            longitude = (doc.get("lon") as? Number)?.toDouble() ?: 0.0
        )

    private fun documentToCart(doc: Document, fallbackCustomerId: String? = null): Cart {
        val cartId = doc.getString("id")
        val customerId = doc.getString("customerId") ?: fallbackCustomerId
        val restaurantId = doc.getString("restaurantId")
        val totalPrice = (doc.get("totalPrice") as? Number)?.toLong() ?: 0L

        val itemsDocs = doc.getList("items", Document::class.java) ?: emptyList()
        val items = itemsDocs.map { documentToCartItem(it) }.toMutableList()

        return Cart(
            id = cartId,
            customerId = customerId,
            restaurantId = restaurantId,
            items = items,
            totalPrice = totalPrice
        )
    }

    private fun documentToCartItem(doc: Document): CartItem {
        val quantity = (doc.get("quantity") as? Number)?.toInt() ?: 0

        return CartItem(
            restaurantId = doc.getString("restaurantId"),
            menuItemId = doc.getString("menuItemId"),
            quantity = quantity
        )
    }
}


