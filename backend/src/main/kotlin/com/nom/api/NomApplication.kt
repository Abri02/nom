package com.nom.api

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class NomApplication

fun main(args: Array<String>) {
	runApplication<NomApplication>(*args)
}
