package dev.valenthyne.kingfishr.classes

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.session.SessionInformation
import org.springframework.security.core.session.SessionRegistry

class ActiveUserManager {

    @Autowired
    lateinit var sessionRegistry: SessionRegistry



    fun getLoggedInUsers(): Map<CustomUserDetails, SessionInformation> {

        val allPrincipals = sessionRegistry.allPrincipals
        val loggedInUsers: MutableMap<CustomUserDetails, SessionInformation> = mutableMapOf()

        for( session in sessionRegistry.getAllSessions( allPrincipals, false ) ) {

            if( session.principal is CustomUserDetails ) {
                loggedInUsers[session.principal as CustomUserDetails] = session
            }

        }

        return loggedInUsers

    }

    fun invalidateUserSession( username: String ): Boolean {

        var invalidated = false
        val userSessions = getLoggedInUsers()

        for( userDetails in userSessions.keys ) {

            if( userDetails.username == username ) {

                val session: SessionInformation? = userSessions[userDetails]

                if( session != null ) {

                    session.expireNow()
                    invalidated = true

                }

            }

        }

        return invalidated

    }

}