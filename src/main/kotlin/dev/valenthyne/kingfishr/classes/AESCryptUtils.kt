package dev.valenthyne.kingfishr.classes

import java.io.InputStream
import java.io.OutputStream
import java.security.SecureRandom
import java.security.spec.KeySpec
import java.util.*
import javax.crypto.Cipher
import javax.crypto.SecretKey
import javax.crypto.SecretKeyFactory
import javax.crypto.spec.IvParameterSpec
import javax.crypto.spec.PBEKeySpec
import javax.crypto.spec.SecretKeySpec

class AESCryptUtils {

    companion object {

        private const val algorithm = "AES/CBC/PKCS5Padding"
        private const val ivLength = 16
        private const val saltLength = 64

        fun getKeyFromPassword( rawPassword: String, salt: ByteArray ): SecretKey {

            val keyFactory: SecretKeyFactory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256")
            val spec: KeySpec = PBEKeySpec(rawPassword.toCharArray(), salt, 65536, 256)

            return SecretKeySpec(keyFactory.generateSecret(spec).encoded, "AES")

        }

        fun generateIv(): IvParameterSpec {

            val iv = ByteArray( ivLength )
            SecureRandom().nextBytes(iv)

            return IvParameterSpec(iv)

        }

        fun generateSalt(): ByteArray {

            val salt = ByteArray( saltLength )
            SecureRandom().nextBytes( salt )

            return salt

        }

        fun generateSecureString(): String {

            val random = SecureRandom()
            val bytes = ByteArray( 128 )

            random.nextBytes( bytes )
            val encoder = Base64.getUrlEncoder().withoutPadding()

            return encoder.encodeToString( bytes ).slice( 0..127 )

        }

        fun getIv( encryptedString: String ): IvParameterSpec {

            val stringBytes = encryptedString.toByteArray()
            val ivBytes = stringBytes.slice( 0 until ivLength ).toByteArray()

            return IvParameterSpec( ivBytes )

        }

        fun encryptString( rawString: String, key: SecretKey ) {

            val ivBytes = generateIv().iv
            val stringBytes = rawString.toByteArray()

            val cipher = Cipher.getInstance( algorithm )
            cipher.init()

        }

    }

}