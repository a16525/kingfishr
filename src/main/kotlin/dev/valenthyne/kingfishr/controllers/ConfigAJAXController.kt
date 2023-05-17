package dev.valenthyne.kingfishr.controllers

import dev.valenthyne.kingfishr.classes.crudops.UserRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestParam

@Controller
class ConfigAJAXController {

    @Autowired
    lateinit var userRepository : UserRepository

    @GetMapping( "/api/user" )
    fun getUser( @RequestParam( name="name", required=true ) name : String ) : ResponseEntity<String> {

        lateinit var response : ResponseEntity<String>

        return response

    }

    @GetMapping( "/api/users" )
    fun getUsers() : ResponseEntity<String> {

        lateinit var response : ResponseEntity<String>

        return response

    }

    @PostMapping( "/api/user" )
    fun createUser( @RequestParam( name="name", required=true ) name : String, @RequestParam( name="pass", required=true ) password : String ) : ResponseEntity<String> {

        lateinit var response : ResponseEntity<String>

        return response

    }

    @DeleteMapping( "/api/user" )
    fun deleteUser( @RequestParam( name="name", required=true ) name : String ) : ResponseEntity<String> {

        lateinit var response : ResponseEntity<String>

        return response

    }

    @PatchMapping( "/api/user" )
    fun renameUser( @RequestParam( name="name", required=true ) name : String, @RequestParam( name="newname", required=true ) newName : String ) : ResponseEntity<String> {

        lateinit var response : ResponseEntity<String>

        return response

    }

}