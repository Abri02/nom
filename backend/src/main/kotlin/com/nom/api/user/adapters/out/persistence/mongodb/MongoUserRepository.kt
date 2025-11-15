package com.nom.api.adapters.out.persistence.mongodb

import com.mongodb.client.MongoCollection
import com.mongodb.client.model.Filters
import domain.entities.*
import com.nom.api.domain.ports.out.UserRepository
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

    override suspend fun save(user: User): User {
        val document = userToDocument(user)
        collection.insertOne(document)
        return user
    }

    override suspend fun findById(id: String): User? {
        val document = collection.find(Filters.eq("_id", id)).firstOrNull()
        return document?.let { documentToUser(it) }
    }

    override suspend fun findByEmail(email: String): User? {
        val document = collection.find(Filters.eq("email", email)).firstOrNull()
        return document?.let { documentToUser(it) }
    }

    override suspend fun findAll(): List<User> {
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
            )
        )
    }
}
