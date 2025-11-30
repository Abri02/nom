package com.nom.api.geoCode

import com.nom.api.domain.order.entities.Address
import com.nom.api.domain.order.entities.GeoPoint

interface GeocodingService {
    fun geocode(address: Address): GeoPoint?
}