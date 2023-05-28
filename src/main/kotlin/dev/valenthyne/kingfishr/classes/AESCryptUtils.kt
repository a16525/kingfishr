package dev.valenthyne.kingfishr.classes

import java.io.File
import java.io.FileInputStream
import java.io.FileOutputStream
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

        fun getKeyFromPassword(rawPassword: String, salt: ByteArray): SecretKey {

            val keyFactory: SecretKeyFactory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256")
            val spec: KeySpec = PBEKeySpec(rawPassword.toCharArray(), salt, 65536, 256)

            return SecretKeySpec(keyFactory.generateSecret(spec).encoded, "AES")

        }

        fun getStringFromKey( key: SecretKey ): String {

            val rawKey = key.encoded
            return Base64.getEncoder().encodeToString( rawKey )

        }

        fun getKeyFromString( stringKey: String ): SecretKey {

            val decodedKey = Base64.getDecoder().decode( stringKey )
            return SecretKeySpec( decodedKey, "AES" )

        }

        fun generateIv(): IvParameterSpec {

            val iv = ByteArray(16)
            SecureRandom().nextBytes(iv)

            return IvParameterSpec(iv)

        }

        fun generateSalt(): ByteArray {

            val salt = ByteArray( 64 )
            SecureRandom().nextBytes( salt )

            return salt

        }

        fun generateCheckValue( key: SecretKey, iv: IvParameterSpec ): String {
            return encryptString( "AAAAAAAA", key, iv ).slice( 0..8 )
        }

        fun generateSecureString(): String {

            val random = SecureRandom()
            val bytes = ByteArray( 128 )

            random.nextBytes( bytes )
            val encoder = Base64.getUrlEncoder().withoutPadding()

            return encoder.encodeToString( bytes ).slice( 0..127 )

        }

        fun encryptString(input: String, key: SecretKey, iv: IvParameterSpec): String {

            val cipher = Cipher.getInstance(algorithm)
            cipher.init(Cipher.ENCRYPT_MODE, key, iv)

            val cipherText: ByteArray = cipher.doFinal(input.toByteArray())

            return Base64.getEncoder().encodeToString(cipherText)

        }

        fun decryptString(cipherText: String, key: SecretKey, iv: IvParameterSpec): String {

            val cipher = Cipher.getInstance(algorithm)
            cipher.init(Cipher.DECRYPT_MODE, key, iv)

            val plainText: ByteArray = cipher.doFinal(Base64.getDecoder().decode(cipherText))

            return String(plainText)

        }

        fun encryptFile(key: SecretKey, iv: IvParameterSpec, inputFile: File, outputFile: File) {

            val cipher = Cipher.getInstance(algorithm)
            cipher.init(Cipher.ENCRYPT_MODE, key, iv)

            val inputStream = FileInputStream(inputFile)
            val outputStream = FileOutputStream(outputFile)

            val buffer = ByteArray(64)
            var bytesRead: Int

            while (true) {

                bytesRead = inputStream.read(buffer)
                if (bytesRead == -1) break

                val output = cipher.update(buffer, 0, bytesRead)
                if (output != null) outputStream.write(output)

            }

            val outputBytes = cipher.doFinal()
            if (outputBytes != null) outputStream.write(outputBytes)

            inputStream.close()
            outputStream.close()

        }

        fun encryptFile(key: SecretKey, iv: IvParameterSpec, inputStream: InputStream, outputStream: OutputStream) {

            val cipher = Cipher.getInstance(algorithm)
            cipher.init(Cipher.ENCRYPT_MODE, key, iv)

            val buffer = ByteArray(64)
            var bytesRead: Int

            while (true) {

                bytesRead = inputStream.read(buffer)
                if (bytesRead == -1) break

                val output = cipher.update(buffer, 0, bytesRead)
                if (output != null) outputStream.write(output)

            }

            val outputBytes = cipher.doFinal()
            if (outputBytes != null) outputStream.write(outputBytes)

            inputStream.close()
            outputStream.close()

        }

        fun decryptFile(key: SecretKey, iv: IvParameterSpec, inputFile: File, outputFile: File) {

            val cipher = Cipher.getInstance(algorithm)
            cipher.init(Cipher.DECRYPT_MODE, key, iv)

            val inputStream = FileInputStream(inputFile)
            val outputStream = FileOutputStream(outputFile)

            val buffer = ByteArray(64)
            var bytesRead: Int

            while (true) {

                bytesRead = inputStream.read(buffer)
                if (bytesRead == -1) break

                val output = cipher.update(buffer, 0, bytesRead)
                if (output != null) outputStream.write(output)

            }

            val outputBytes = cipher.doFinal()
            if (outputBytes != null) outputStream.write(outputBytes)

            inputStream.close()
            outputStream.close()

        }

        fun decryptFile(key: SecretKey, iv: IvParameterSpec, inputStream: InputStream, outputStream: OutputStream) {

            val cipher = Cipher.getInstance(algorithm)
            cipher.init(Cipher.DECRYPT_MODE, key, iv)

            val buffer = ByteArray(64)
            var bytesRead: Int

            while (true) {

                bytesRead = inputStream.read(buffer)
                if (bytesRead == -1) break

                val output = cipher.update(buffer, 0, bytesRead)
                if (output != null) outputStream.write(output)

            }

            val outputBytes = cipher.doFinal()
            if (outputBytes != null) outputStream.write(outputBytes)

            inputStream.close()
            outputStream.close()

        }

    }

}