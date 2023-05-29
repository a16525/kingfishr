package dev.valenthyne.kingfishr.classes

import kotlin.Pair
import dev.valenthyne.kingfishr.classes.crudops.UserEncryptionDetailsRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import javax.crypto.spec.IvParameterSpec

@Component
class SessionEncryptionTokenManager {

    @Autowired
    private lateinit var userEncryptionDetailsRepository: UserEncryptionDetailsRepository

    private val sessionEncryptionTokenMap: MutableMap<String, Pair<String, String>> = mutableMapOf()
    fun createSessionEncryptionToken( userId: Long, rawPassword: String, sessionId: String ): Boolean {

        var created = false
        val encryptionDetails = userEncryptionDetailsRepository.getEncryptionDetailsFromUserId( userId )

        if( encryptionDetails != null ) {



        }

        return created

    }

    fun getSessionEncryptionPair( sessionId: String ): Pair<String, String>? {
        return sessionEncryptionTokenMap[sessionId]
    }

    fun destroySessionEncryptionToken( sessionId : String ): Boolean {
        return sessionEncryptionTokenMap.remove( sessionId ) != null
    }

}