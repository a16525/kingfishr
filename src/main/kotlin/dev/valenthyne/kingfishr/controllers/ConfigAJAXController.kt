package dev.valenthyne.kingfishr.controllers

import com.fasterxml.jackson.databind.ObjectMapper
import dev.valenthyne.kingfishr.classes.crudops.UserRepository
import dev.valenthyne.kingfishr.classes.crudops.models.User
import dev.valenthyne.kingfishr.classes.crudops.models.UserInfo
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.AnonymousAuthenticationToken
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestParam

class ConfigAJAXController {

    @Autowired
    private lateinit var userRepository: UserRepository

    @GetMapping( "/api/user" )
    fun getUser( @RequestParam( name = "id", required = false ) id: Long?,
                 @RequestParam( name = "name", required = false ) name: String? ): ResponseEntity<String> {

        val authentication = SecurityContextHolder.getContext().authentication
        lateinit var response: ResponseEntity<String>

        if( authentication is AnonymousAuthenticationToken ) {
            response = ResponseEntity( HttpStatus.FORBIDDEN )
        } else {

            if( id == null && name == null ) {
                response = ResponseEntity( "Parameter 'id' or 'name' must be set.", HttpStatus.BAD_REQUEST )
            } else {

                var user : User? = null

                if( id != null ) {
                    user = userRepository.getUserByID( id )
                } else
                if( name != null ) {
                    user = userRepository.getUserByUsername( name )
                }

                if( user != null ) {

                    val userInfo = UserInfo( user )

                    val jsonWriter = ObjectMapper().writer()
                    val dataJSON = jsonWriter.writeValueAsString( userInfo )

                    val headers = HttpHeaders()
                    headers.contentType = MediaType.APPLICATION_JSON

                    response = ResponseEntity( dataJSON, headers, HttpStatus.OK )

                } else {
                    response = ResponseEntity( HttpStatus.NOT_FOUND )
                }

            }

        }

        return response

    }

    @GetMapping( "/api/users" )
    fun getAllUsers(): ResponseEntity<String> {

        val authentication = SecurityContextHolder.getContext().authentication
        lateinit var response: ResponseEntity<String>

        if( authentication is AnonymousAuthenticationToken ) {
            response = ResponseEntity( HttpStatus.FORBIDDEN )
        } else {

            val users = userRepository.findAll().toList()

            if( users.isEmpty() ) {

                response = ResponseEntity( HttpStatus.INTERNAL_SERVER_ERROR )
                println( "User database is empty." )

            } else {

                val userInfo = users.map { user -> UserInfo( user ) }

                val jsonWriter = ObjectMapper().writer()
                val dataJSON = jsonWriter.writeValueAsString( userInfo )

                val headers = HttpHeaders()
                headers.contentType = MediaType.APPLICATION_JSON

                response = ResponseEntity( dataJSON, headers, HttpStatus.OK )

            }

        }

        return response

    }

    @PostMapping( "/api/user" )
    fun createUser( @RequestParam( name = "name", required = true ) name: String,
                    @RequestParam( name = "password", required = true ) password: String ): ResponseEntity<String> {

        val authentication = SecurityContextHolder.getContext().authentication
        lateinit var response: ResponseEntity<String>

        if( authentication is AnonymousAuthenticationToken || !authentication.authorities.contains( GrantedAuthority { "ROLE_ADMIN" } ) ) {
            response = ResponseEntity( HttpStatus.FORBIDDEN )
        } else {

            val encodedPassword = BCryptPasswordEncoder().encode( password )

            val newUser = User( username = name, password = encodedPassword )
            userRepository.save( newUser )

            response = ResponseEntity( HttpStatus.CREATED )

        }

        return response

    }

    @PatchMapping( "/api/user" )
    fun renameUser( @RequestParam( name = "id", required = false ) id: Long?,
                    @RequestParam( name = "name", required = false ) name: String?,
                    @RequestParam( name = "newname", required = true ) newName: String ): ResponseEntity<String> {

        val authentication = SecurityContextHolder.getContext().authentication
        lateinit var response: ResponseEntity<String>

        if( authentication is AnonymousAuthenticationToken || !authentication.authorities.contains( GrantedAuthority { "ROLE_ADMIN" } ) ) {
            response = ResponseEntity( HttpStatus.FORBIDDEN )
        } else {

            if( id == null && name == null ) {
                response = ResponseEntity( "Parameter 'id' or 'name' must be set.", HttpStatus.BAD_REQUEST )
            } else {

                var user : User? = null

                if( id != null ) {
                    user = userRepository.getUserByID( id )
                } else
                if( name != null ) {
                    user = userRepository.getUserByUsername( name )
                }

                if( user != null ) {

                    user.username = newName
                    userRepository.save( user )

                    response = ResponseEntity( HttpStatus.OK )

                } else {
                    response = ResponseEntity( HttpStatus.NOT_FOUND )
                }

            }

        }

        return response

    }

    @DeleteMapping( "/api/user" )
    fun deleteUser( @RequestParam( name = "id", required = false ) id: Long?,
                    @RequestParam( name = "name", required = false ) name: String? ): ResponseEntity<String> {

        val authentication = SecurityContextHolder.getContext().authentication
        lateinit var response: ResponseEntity<String>

        if( authentication is AnonymousAuthenticationToken || !authentication.authorities.contains( GrantedAuthority { "ROLE_ADMIN" } ) ) {
            response = ResponseEntity( HttpStatus.FORBIDDEN )
        } else {

            if( id == null && name == null ) {
                response = ResponseEntity( "Parameter 'id' or 'name' must be set.", HttpStatus.BAD_REQUEST )
            } else {

                var user : User? = null

                if( id != null ) {
                    user = userRepository.getUserByID( id )
                } else
                    if( name != null ) {
                        user = userRepository.getUserByUsername( name )
                    }

                if( user != null ) {

                    userRepository.delete( user )
                    response = ResponseEntity( HttpStatus.OK )

                } else {
                    response = ResponseEntity( HttpStatus.NOT_FOUND )
                }

            }

        }

        return response

    }

}