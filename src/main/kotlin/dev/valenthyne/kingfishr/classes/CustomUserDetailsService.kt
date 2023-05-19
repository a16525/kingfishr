package dev.valenthyne.kingfishr.classes

import dev.valenthyne.kingfishr.classes.crudops.UserRepository
import dev.valenthyne.kingfishr.classes.crudops.models.User
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder

class CustomUserDetailsService: UserDetailsService {

    @Autowired
    private lateinit var userRepository: UserRepository

    override fun loadUserByUsername( username: String ): UserDetails {

        if( userRepository.findAll().size == 0 ) {

            val defaultConfiguratorUser = User(
                    username="configurator",
                    password=BCryptPasswordEncoder().encode( "password" )
            )

            defaultConfiguratorUser.isConfigurator = true
            userRepository.save( defaultConfiguratorUser )

        }

        val user = userRepository.getUserByUsername( username )
                ?: throw UsernameNotFoundException( "User not found" )

        return CustomUserDetails( user )

    }


}