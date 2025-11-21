package com.nom.api.domain.order.entities

enum class OrderStatus{
    NEW,
    PREPARING,
    READY,
    ON_DELIVERY,
    DELIVERED,
    CANCELLED
}