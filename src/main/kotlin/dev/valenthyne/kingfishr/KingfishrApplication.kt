package dev.valenthyne.kingfishr

import dev.valenthyne.kingfishr.classes.AESCryptUtils
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import java.io.File

@SpringBootApplication
class KingfishrApplication

fun main(args: Array<String>) {
	runApplication<KingfishrApplication>(*args)
}
