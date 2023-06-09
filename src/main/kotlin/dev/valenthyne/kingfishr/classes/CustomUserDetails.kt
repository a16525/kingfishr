package dev.valenthyne.kingfishr.classes

import dev.valenthyne.kingfishr.classes.crudops.models.User
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails

class CustomUserDetails( private var user: User ): UserDetails {

    override fun getAuthorities(): MutableCollection<GrantedAuthority> {

        val authorities = mutableListOf<GrantedAuthority>()

        if( user.isConfigurator ) {
            authorities.add( SimpleGrantedAuthority( "ROLE_ADMIN" ) )
        } else {
            authorities.add( SimpleGrantedAuthority( "ROLE_USER" ) )
        }

        return authorities

    }

    override fun getPassword(): String {
        return user.password
    }

    override fun getUsername(): String {
        return user.username
    }

    override fun isAccountNonExpired(): Boolean {
        return true
    }

    override fun isAccountNonLocked(): Boolean {
        return true
    }

    override fun isCredentialsNonExpired(): Boolean {
        return true
    }

    override fun isEnabled(): Boolean {
        return true
    }

}