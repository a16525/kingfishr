package dev.valenthyne.kingfishr.classes

import java.io.InputStream
import java.io.OutputStream
import java.nio.ByteBuffer
import java.security.SecureRandom
import java.security.spec.KeySpec
import java.util.*
import javax.crypto.Cipher
import javax.crypto.SecretKey
import javax.crypto.SecretKeyFactory
import javax.crypto.spec.IvParameterSpec
import javax.crypto.spec.PBEKeySpec
import javax.crypto.spec.SecretKeySpec

// Big thanks to https://github.com/jaysridhar/java-stuff/blob/master/source/rsa-encryption/src/main/java/sample/sample1.java
// and https://www.baeldung.com/java-aes-encryption-decryption
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

            val stringBytes = Base64.getDecoder().decode( encryptedString )
            val ivBytes = stringBytes.slice(0 until ivLength).toByteArray()

            return IvParameterSpec( ivBytes )

        }

        fun getIv( inputStream: InputStream ): IvParameterSpec {

            val ivBuffer = ByteArray( ivLength )
            inputStream.read( ivBuffer, 0, ivLength )

            return IvParameterSpec( ivBuffer )

        }

        fun encryptString( rawString: String, key: SecretKey ): String {

            val iv = generateIv()
            val ivBytes = iv.iv

            val cipher = Cipher.getInstance( algorithm )
            cipher.init( Cipher.ENCRYPT_MODE, key, iv )

            val stringBytes = rawString.toByteArray()
            val encryptedStringBytes = cipher.doFinal( stringBytes )

            val byteBuffer = ByteBuffer.allocate( encryptedStringBytes.size + ivBytes.size )

            byteBuffer.put( ivBytes )
            byteBuffer.put( encryptedStringBytes )

            val finishedBytes = byteBuffer.array()
            return Base64.getEncoder().encodeToString( finishedBytes )

        }

        fun decryptString( encryptedString: String, key: SecretKey ): String {

            val iv = getIv( encryptedString )

            val cipher = Cipher.getInstance( algorithm )
            cipher.init( Cipher.DECRYPT_MODE, key, iv )

            val decoder = Base64.getDecoder()
            val decodedString = decoder.decode( encryptedString )
            val encryptedStringBytes = decodedString.slice( ivLength until decodedString.size ).toByteArray()

            val plainString = cipher.doFinal( encryptedStringBytes )

            return String( plainString )

        }

        fun processFile( cipher: Cipher, inputStream: InputStream, outputStream: OutputStream ) {

            val inputBuffer = ByteArray( 1024 )
            var bytesRead: Int

            while( true ) {

                bytesRead = inputStream.read( inputBuffer )
                if( bytesRead == -1 ) break

                val outputBuffer = cipher.update( inputBuffer, 0, bytesRead )
                if( outputBuffer != null ) outputStream.write( outputBuffer )

            }

            val outputBuffer = cipher.doFinal()
            if( outputBuffer != null ) outputStream.write( outputBuffer )

            inputStream.close()
            outputStream.close()

        }

        fun encryptFile( key: SecretKey, inputStream: InputStream, outputStream: OutputStream ) {

            val iv = generateIv()
            val ivBytes = iv.iv

            val cipher = Cipher.getInstance( algorithm )
            cipher.init( Cipher.ENCRYPT_MODE, key, iv )

            outputStream.write( ivBytes )
            processFile( cipher, inputStream, outputStream )

        }

        fun decryptFile( key: SecretKey, inputStream: InputStream, outputStream: OutputStream ) {

            val iv = getIv( inputStream )

            val cipher = Cipher.getInstance( algorithm )
            cipher.init( Cipher.DECRYPT_MODE, key, iv )

            processFile( cipher, inputStream, outputStream )

        }

    }

}