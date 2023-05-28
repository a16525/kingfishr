package dev.valenthyne.kingfishr.classes

import dev.valenthyne.kingfishr.classes.crudops.UserRepository
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import jakarta.servlet.http.HttpSession
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.Authentication
import org.springframework.security.web.DefaultRedirectStrategy
import org.springframework.security.web.RedirectStrategy
import org.springframework.security.web.WebAttributes
import org.springframework.security.web.authentication.AuthenticationSuccessHandler

class CustomAuthenticationHandler: AuthenticationSuccessHandler {

    private val logger = Logger.logger

    @Autowired
    private lateinit var sessionEncryptionTokenManager: SessionEncryptionTokenManager

    @Autowired
    private lateinit var userRepository: UserRepository

    private val redirectStrategy: RedirectStrategy = DefaultRedirectStrategy()

    override fun onAuthenticationSuccess( request: HttpServletRequest, response: HttpServletResponse, authentication: Authentication ) {

        val username = authentication.name
        val user = userRepository.getUserByUsername( username )

        logger.info( "User \"$username\" logged in with authorities ${authentication.authorities.toList()}, session ${request.session.id}" )

        if( user != null ) {

            if( !user.isConfigurator ) {

                val created = sessionEncryptionTokenManager.createSessionEncryptionToken(user.id!!, request.getParameter("password"), request.session.id)
                if (created) {
                    logger.info("Generated session encryption token for user \"$username\".")
                } else {
                    logger.error("Failed to generate session encryption token for user \"$username\".")
                }

            }

        } else {
            logger.error("User $username doesn't exist in database.")
        }

        handle( request, response, authentication )
        clearAuthenticationAttributes( request )

    }

    private fun handle( request: HttpServletRequest, response: HttpServletResponse, authentication: Authentication ) {

        val targetURL: String = determineTargetURL( authentication )

        if( response.isCommitted ) return
        redirectStrategy.sendRedirect( request, response, targetURL )

    }

    private fun clearAuthenticationAttributes( request: HttpServletRequest ) {

        val session: HttpSession = request.getSession( false )
        session.removeAttribute( WebAttributes.AUTHENTICATION_EXCEPTION )

    }

    private fun determineTargetURL( authentication: Authentication ): String {

        var targetURL = "/"
        val roleTargetURLMap: MutableMap<String, String> = mutableMapOf()

        roleTargetURLMap[ "ROLE_USER" ]  = "/"
        roleTargetURLMap[ "ROLE_ADMIN" ] = "/config"

        val authorities = authentication.authorities

        for( grantedAuthority in authorities ) {

            val authorityName = grantedAuthority.authority

            if( roleTargetURLMap.containsKey( authorityName ) ) {

                targetURL = roleTargetURLMap[authorityName].toString()
                break

            }

        }

        return targetURL

    }

}