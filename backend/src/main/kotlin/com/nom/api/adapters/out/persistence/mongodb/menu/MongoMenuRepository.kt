package com.nom.api.adapters.out.persistence.mongodb.menu

import com.mongodb.client.MongoCollection
import com.mongodb.client.model.Filters
import com.mongodb.client.model.ReplaceOptions
import com.mongodb.client.model.Updates
import com.nom.api.domain.menu.entities.Menu
import com.nom.api.domain.menu.entities.MenuItem
import com.nom.api.domain.menu.entities.RestaurantProfile
import com.nom.api.domain.menu.ports.out.MenuRepository
import org.bson.Document
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Repository
import java.math.BigDecimal
import java.util.*

@Repository
class MongoMenuRepository(
    /**
     * Ugyanaz a collection, mint ami a User-eket tárolja.
     * Minden RESTAURANT role-ú user tartalmazhat egy restaurantProfile mezőt.
     */
    @Qualifier("restaurantsCollection") private val collection: MongoCollection<Document>
) : MenuRepository {

    override fun getRestaurantProfile(restaurantId: String): RestaurantProfile? {
        val doc = collection.find(Filters.eq("_id", restaurantId)).firstOrNull()
        return doc?.let { documentToRestaurantProfile(it) }
    }

    override fun updateRestaurantProfile(
        restaurantId: String,
        profile: RestaurantProfile
    ): RestaurantProfile {
        val doc = restaurantProfileToDocument(profile)

        // ha létezik → replace, ha nem → insert
        val result = collection.replaceOne(
            Filters.eq("_id", restaurantId),
            doc,
            ReplaceOptions().upsert(true)
        )

        return profile
    }

    override fun getMenu(restaurantId: String): Menu? {
        val doc = collection.find(Filters.eq("_id", restaurantId)).firstOrNull() ?: return null
        val menuDoc = doc.get("menu", Document::class.java)
        return documentToMenu(menuDoc)
    }

    override fun addMenuItem(
        restaurantId: String,
        item: MenuItem
    ): MenuItem {
        val menuItem = if (item.id.isBlank()) {
            item.copy(id = UUID.randomUUID().toString())
        } else item

        val itemDoc = menuItemToDocument(menuItem)

        val result = collection.updateOne(
            Filters.eq("_id", restaurantId),
            Updates.push("menu.menuItems", itemDoc)
        )

        if (result.matchedCount == 0L) {
            throw IllegalStateException("Restaurant with id $restaurantId not found")
        }

        return menuItem
    }

    override fun updateMenuItem(
        restaurantId: String,
        item: MenuItem
    ): MenuItem {
        val filter = Filters.and(
            Filters.eq("_id", restaurantId),
            Filters.eq("menu.menuItems.id", item.id)
        )

        val updates = Updates.combine(
            Updates.set("menu.menuItems.$.name", item.name),
            Updates.set("menu.menuItems.$.description", item.description),
            Updates.set("menu.menuItems.$.price", item.price.toDouble()),
            Updates.set("menu.menuItems.$.allergens", item.allergens),
            Updates.set("menu.menuItems.$.imageUrl", item.imageUrl)
        )

        val result = collection.updateOne(filter, updates)
        if (result.matchedCount == 0L) {
            throw IllegalStateException("Menu item with id ${item.id} not found for restaurant $restaurantId")
        }

        return item
    }

    override fun deleteMenuItem(
        restaurantId: String,
        menuItemId: String
    ): Boolean {
        val filter = Filters.eq("_id", restaurantId)
        val update = Updates.pull(
            "menu.menuItems",
            Document("id", menuItemId)
        )

        val result = collection.updateOne(filter, update)
        return result.modifiedCount > 0
    }

    override fun findAllRestaurants(): List<RestaurantProfile> {
        return collection.find()
            .map { doc -> documentToRestaurantProfile(doc) }
            .toList()
    }

    override fun findByRestaurantId(restaurantId: String): Menu? {
        return getMenu(restaurantId)
    }

    // ---------- Mapping függvények ----------

    private fun restaurantProfileToDocument(profile: RestaurantProfile): Document =
        Document()
            .append("restaurantName", profile.restaurantName)
            .append("openingHours", profile.openingHours)
            .append("menu", menuToDocument(profile.menu))

    private fun documentToRestaurantProfile(doc: Document): RestaurantProfile {
        val menuDoc = doc.get("menu", Document::class.java)
        return RestaurantProfile(
            restaurantName = doc.getString("restaurantName"),
            openingHours = doc.getString("openingHours"),
            menu = documentToMenu(menuDoc)
        )
    }

    private fun menuToDocument(menu: Menu): Document =
        Document().append("menuItems", menu.menuItems.map { menuItemToDocument(it) })

    private fun documentToMenu(doc: Document?): Menu {
        if (doc == null) return Menu(emptyList())
        val itemsDocs = doc.getList("menuItems", Document::class.java) ?: emptyList()
        val items = itemsDocs.map { documentToMenuItem(it) }
        return Menu(items)
    }

    private fun menuItemToDocument(item: MenuItem): Document =
        Document()
            .append("id", item.id)
            .append("name", item.name)
            .append("description", item.description)
            .append("price", item.price.toDouble())
            .append("allergens", item.allergens)
            .append("imageUrl", item.imageUrl)

    private fun documentToMenuItem(doc: Document): MenuItem {
        val priceNumber = (doc.get("price") as? Number)?.toLong() ?: 0L

        @Suppress("UNCHECKED_CAST")
        val allergens = doc.get("allergens") as? List<String> ?: emptyList()

        return MenuItem(
            id = doc.getString("id"),
            name = doc.getString("name"),
            description = doc.getString("description"),
            price = priceNumber,
            allergens = allergens,
            imageUrl = doc.getString("imageUrl")
        )
    }
}