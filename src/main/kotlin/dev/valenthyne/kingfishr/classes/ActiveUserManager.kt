package dev.valenthyne.kingfishr.classes

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.session.SessionInformation
import org.springframework.security.core.session.SessionRegistry
import org.springframework.stereotype.Component

@Component
class ActiveUserManager {

    @Autowired
    private lateinit var sessionRegistry: SessionRegistry

    fun getLoggedInUsers(): Map<String, SessionInformation> {

        val users: MutableMap<String, SessionInformation> = mutableMapOf()
        val principals = sessionRegistry.allPrincipals

        for( principal in principals ) {

            for( session in sessionRegistry.getAllSessions( principal, false ) ) {

                val userDetails = principal as CustomUserDetails
                users[userDetails.username] = session

            }

        }

        return users

    }

    fun invalidateUserSession( username: String ): Boolean {

        var invalidated = false
        val activeUsers = getLoggedInUsers()
        val user = activeUsers[username]

        if( user != null ) {

            user.expireNow()
            invalidated = true

        }

        return invalidated

    }

}