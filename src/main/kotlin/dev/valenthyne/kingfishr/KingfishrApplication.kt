package dev.valenthyne.kingfishr

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import kotlin.io.path.Path
import kotlin.io.path.createDirectory
import kotlin.io.path.exists

@SpringBootApplication
class KingfishrApplication

fun main(args: Array<String>) {

	runApplication<KingfishrApplication>(*args)

	val storageDirectory = Path( "storage" )
	if( !storageDirectory.exists() ) {
		storageDirectory.createDirectory()
	}

}
