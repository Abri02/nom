package com.nom.api.geoCode

import com.nom.api.domain.order.entities.Address
import com.nom.api.domain.order.entities.GeoPoint
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate
import org.springframework.web.util.UriComponentsBuilder

@Service
class OpenCageGeocodingService(
    @Value("bf94ee75f4b04a7e83b232b54123da32") private val apiKey: String,
    private val restTemplate: RestTemplate
): GeocodingService {

    override fun geocode(address: Address): GeoPoint? {
        val query = "${address.postalCode} ${address.city}, ${address.street} ${address.houseNumber}, Hungary"

        val uri = UriComponentsBuilder
            .fromHttpUrl("https://api.opencagedata.com/geocode/v1/json")
            .queryParam("q", query)
            .queryParam("key", apiKey)
            .queryParam("limit", 1)
            .queryParam("language", "hu")
            .queryParam("countrycode", "hu")
            .build()
            .encode()
            .toUri()

        val response = restTemplate.getForObject(uri, OpenCageResponse::class.java)
            ?: return null

        val firstResult = response.results.firstOrNull() ?: return null
        val geometry = firstResult.geometry ?: return null

        return GeoPoint(
            latitude = geometry.lat,
            longitude = geometry.lng
        )
    }
}

data class OpenCageResponse(
    val results: List<OpenCageResult> = emptyList()
)

data class OpenCageResult(
    val geometry: OpenCageGeometry?
)

data class OpenCageGeometry(
    val lat: Double,
    val lng: Double
)