package com.nom.api.config

import com.mongodb.client.MongoClient
import com.mongodb.client.MongoClients
import com.mongodb.client.MongoCollection
import com.nom.api.adapters.out.persistence.mongodb.MongoUserRepository
import com.nom.api.adapters.out.persistence.mongodb.menu.MongoMenuRepository
import com.nom.api.domain.menu.ports.out.MenuRepository
import com.nom.api.domain.ports.out.UserRepository
import org.bson.Document
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

/**
 * MongoDB Configuration
 * Creates and configures MongoDB beans using Spring Data MongoDB
 */
@Configuration
class MongoConfig {

    @Value("\${spring.data.mongodb.uri:mongodb://localhost:27017}")
    private lateinit var mongoUri: String

    @Value("\${spring.data.mongodb.database:nom_db}")
    private lateinit var databaseName: String

    @Bean
    fun mongoClient(): MongoClient {
        return MongoClients.create(mongoUri)
    }

    @Bean
    fun usersCollection(mongoClient: MongoClient): MongoCollection<Document> {
        val database = mongoClient.getDatabase(databaseName)
        return database.getCollection("users")
    }

    @Bean
    fun userRepository(usersCollection: MongoCollection<Document>): UserRepository {
        return MongoUserRepository(usersCollection)
    }

    @Bean
    fun restaurantsCollection(mongoClient: MongoClient): MongoCollection<Document> {
        val database = mongoClient.getDatabase(databaseName)
        return database.getCollection("restaurants")   // ÚJ COLLECTION
    }

    @Bean
    fun menuRepository(restaurantsCollection: MongoCollection<Document>): MenuRepository =
        MongoMenuRepository(restaurantsCollection)
}
