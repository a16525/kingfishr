package dev.valenthyne.kingfishr.controllers

import com.fasterxml.jackson.databind.ObjectMapper
import dev.valenthyne.kingfishr.classes.crudops.models.User
import dev.valenthyne.kingfishr.classes.crudops.UserRepository
import dev.valenthyne.kingfishr.classes.crudops.models.UserInfo
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestParam

@Controller
class ConfigAJAXController {

    @Autowired
    private lateinit var userRepository : UserRepository

    @GetMapping( "/api/user" )
    fun getUser( @RequestParam( name="name", required=true ) name : String ) : ResponseEntity<String> {

        lateinit var response : ResponseEntity<String>
        val user = userRepository.getUserByUsername( name )

        response = if( user != null ) {

            val userInfo = UserInfo( user )

            val jsonWriter = ObjectMapper().writer()
            val entriesJSON = jsonWriter.writeValueAsString( userInfo )
            val headers = HttpHeaders()

            headers.contentType = MediaType.APPLICATION_JSON

            ResponseEntity( entriesJSON, headers, HttpStatus.OK )

        } else {
            ResponseEntity( HttpStatus.NOT_FOUND )
        }

        return response

    }

    @GetMapping( "/api/users" )
    fun getUsers() : ResponseEntity<String> {

        lateinit var response : ResponseEntity<String>
        val users = userRepository.findAll()

        response = if( users.size != 0 ) {

            val userInfo = users.map { user -> UserInfo( user ) }

            val jsonWriter = ObjectMapper().writer()
            val entriesJSON = jsonWriter.writeValueAsString( userInfo )
            val headers = HttpHeaders()

            headers.contentType = MediaType.APPLICATION_JSON

            ResponseEntity( entriesJSON, headers, HttpStatus.OK )

        } else {
            ResponseEntity( HttpStatus.NOT_FOUND )
        }

        return response

    }

    @PostMapping( "/api/user" )
    fun createUser( @RequestParam( name="name", required=true ) name : String, @RequestParam( name="pass", required=true ) password : String ) : ResponseEntity<String> {

        val encoder = BCryptPasswordEncoder()
        val encodedPassword = encoder.encode( password )

        val newUser = User( username=name, password=encodedPassword )
        userRepository.save( newUser )

        return ResponseEntity( HttpStatus.OK )

    }

    @DeleteMapping( "/api/user" )
    fun deleteUser( @RequestParam( name="name", required=true ) name : String ) : ResponseEntity<String> {

        lateinit var response : ResponseEntity<String>

        val user = userRepository.getUserByUsername( name )

        response = if( user != null ) {

            userRepository.delete( user )
            ResponseEntity( HttpStatus.OK )

        } else {
            ResponseEntity( HttpStatus.NOT_FOUND )
        }

        return response

    }

    @PatchMapping( "/api/user" )
    fun renameUser( @RequestParam( name="name", required=true ) name : String, @RequestParam( name="newname", required=true ) newName : String ) : ResponseEntity<String> {

        lateinit var response : ResponseEntity<String>

        val user = userRepository.getUserByUsername( name )

        response = if( user != null ) {

            user.username = newName
            userRepository.save( user )

            ResponseEntity( HttpStatus.OK )

        } else {
            ResponseEntity( HttpStatus.NOT_FOUND )
        }

        return response

    }

}