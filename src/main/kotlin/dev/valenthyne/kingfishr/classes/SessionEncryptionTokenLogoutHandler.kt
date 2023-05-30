package dev.valenthyne.kingfishr.classes

import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.Authentication
import org.springframework.security.web.authentication.logout.LogoutHandler

class SessionEncryptionTokenLogoutHandler: LogoutHandler {

    @Autowired
    private lateinit var sessionEncryptionTokenManager: SessionEncryptionTokenManager

    private val logger = Logger.logger

    override fun logout( request: HttpServletRequest, response: HttpServletResponse?, authentication: Authentication? ) {

        val sessionId = request.session.id

        if( sessionEncryptionTokenManager.destroySessionEncryptionToken( sessionId ) ) {
            logger.info( "Destroyed session encryption token for session ID \"$sessionId\"" )
        } else {
            logger.warn( "Couldn't destroy session encryption token for session ID \"$sessionId\". Ignore this error if the user is a configurator." )
        }

    }

}