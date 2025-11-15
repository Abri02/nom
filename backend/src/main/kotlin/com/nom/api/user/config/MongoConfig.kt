package com.nom.api.config

import com.mongodb.client.MongoClient
import com.mongodb.client.MongoClients
import com.nom.api.adapters.out.persistence.mongodb.MongoUserRepository
import com.nom.api.domain.ports.out.UserRepository
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
    fun userRepository(mongoClient: MongoClient): UserRepository {
        val database = mongoClient.getDatabase(databaseName)
        val collection = database.getCollection("users")
        return MongoUserRepository(collection)
    }
}
