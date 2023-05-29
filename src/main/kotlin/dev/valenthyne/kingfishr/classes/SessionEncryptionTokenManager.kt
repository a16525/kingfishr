package dev.valenthyne.kingfishr.classes

import kotlin.Pair
import dev.valenthyne.kingfishr.classes.crudops.UserEncryptionDetailsRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import javax.crypto.BadPaddingException

@Component
class SessionEncryptionTokenManager {

    private val logger = Logger.logger

    @Autowired
    private lateinit var userEncryptionDetailsRepository: UserEncryptionDetailsRepository

    private val sessionEncryptionTokenMap: MutableMap<String, String> = mutableMapOf()
    fun createSessionEncryptionToken( userId: Long, rawPassword: String, sessionId: String ): Boolean {

        var created = false
        val encryptionDetails = userEncryptionDetailsRepository.getEncryptionDetailsFromUserId( userId )

        if( encryptionDetails != null ) {

            val key = AESCryptUtils.getKeyFromPassword( rawPassword, encryptionDetails.salt )

            try {

                val rawToken = AESCryptUtils.decryptString( encryptionDetails.token, key )
                val sessionKey = AESCryptUtils.getKeyFromPassword( sessionId, encryptionDetails.salt )
                val sessionEncryptedToken = AESCryptUtils.encryptString( rawToken, sessionKey )

                sessionEncryptionTokenMap[sessionId] = sessionEncryptedToken

                created = true

            } catch( exc: BadPaddingException ) {
                logger.error( "Couldn't generate encryption token. Bad password." )
            }

        }

        return created

    }

    fun getSessionEncryptionToken( sessionId: String ): String? {
        return sessionEncryptionTokenMap[sessionId]
    }

    fun destroySessionEncryptionToken( sessionId : String ): Boolean {
        return sessionEncryptionTokenMap.remove( sessionId ) != null
    }

}