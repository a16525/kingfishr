package dev.valenthyne.kingfishr.controllers

import com.fasterxml.jackson.databind.ObjectMapper
import dev.valenthyne.kingfishr.classes.AESCryptUtils
import dev.valenthyne.kingfishr.classes.KFGenericDataEntry
import dev.valenthyne.kingfishr.classes.SessionEncryptionTokenManager
import dev.valenthyne.kingfishr.classes.crudops.UserEncryptionDetailsRepository
import dev.valenthyne.kingfishr.classes.crudops.UserRepository
import jakarta.servlet.http.HttpServletResponse
import jakarta.servlet.http.HttpSession
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.AnonymousAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.multipart.MultipartFile
import java.io.File
import java.io.IOException
import java.nio.file.DirectoryNotEmptyException
import java.nio.file.Files
import java.nio.file.Path
import javax.crypto.BadPaddingException
import kotlin.io.path.*

@Controller
class UserAJAXController {

    @Autowired
    private lateinit var userRepository: UserRepository

    @Autowired
    private lateinit var userEncryptionDetailsRepository: UserEncryptionDetailsRepository

    @Autowired
    private lateinit var sessionEncryptionTokenManager: SessionEncryptionTokenManager

    fun verifyPathTraversing(basePath: Path, checkPath: Path): Boolean {
        val canonicalBasePath = basePath.toRealPath()
        val canonicalCheckPath = checkPath.toRealPath()
        return canonicalCheckPath.startsWith(canonicalBasePath)
    }

    @GetMapping("/api/dir/contents")
    fun listFiles(
        @RequestParam( name = "dir", required = true ) path: String
    ): ResponseEntity<String> {

        val authentication = SecurityContextHolder.getContext().authentication
        lateinit var response: ResponseEntity<String>

        if( authentication !is AnonymousAuthenticationToken ) {

            val baseDirectoryString = "storage/" + authentication.name
            val baseDirectoryPath = Path(baseDirectoryString)

            val workingDirectoryString = baseDirectoryString + if(path.startsWith("/")) path else "/$path"
            val workingDirectoryPath = Path(workingDirectoryString)

            if( verifyPathTraversing(baseDirectoryPath, workingDirectoryPath) ) {

                if( workingDirectoryPath.exists() ) {

                    val rawEntries = workingDirectoryPath.listDirectoryEntries()
                    val compiledEntries: MutableList<KFGenericDataEntry> = mutableListOf()

                    for(entry in rawEntries) {

                        val relativePath = entry.relativeTo(baseDirectoryPath).pathString

                        if( entry.isDirectory() ) {
                            compiledEntries.add( KFGenericDataEntry(entry.name, "dir", -1, relativePath) )
                        } else {
                            compiledEntries.add( KFGenericDataEntry( entry.toFile(), relativePath ) )
                        }

                    }

                    val jsonWriter = ObjectMapper().writer()
                    val parsedEntries = jsonWriter.writeValueAsString(compiledEntries)

                    val headers = HttpHeaders()
                    headers.contentType = MediaType.APPLICATION_JSON

                    response = ResponseEntity(parsedEntries, headers, HttpStatus.OK)

                } else {
                    response = ResponseEntity("Folder not found", HttpStatus.NOT_FOUND)
                }

            } else {
                response = ResponseEntity(HttpStatus.FORBIDDEN)
            }

        }

        return response

    }

    @PostMapping("/api/dir")
    fun createDirectory(
        @RequestParam( name = "dir", required = true ) dir: String,
        @RequestParam( name = "dirname", required = true ) dirname: String
    ): ResponseEntity<String> {

        val authentication = SecurityContextHolder.getContext().authentication
        lateinit var response: ResponseEntity<String>

        if( authentication !is AnonymousAuthenticationToken ) {

            if( !dirname.contains( Regex( """#%&\{}<>*?/\$!'\\":@+`|=""" ) ) ) {

                val baseDirectoryString = "storage/" + authentication.name
                val baseDirectoryPath = Path(baseDirectoryString)

                val workingDirectoryString = baseDirectoryString + if(dir.startsWith("/")) dir else "/$dir"
                val workingDirectoryPath = Path(workingDirectoryString)

                if( verifyPathTraversing(baseDirectoryPath, workingDirectoryPath) ) {

                    val directoryToCreateString = "$workingDirectoryString/$dirname"
                    val directoryToCreatePath = Path(directoryToCreateString)

                    if( !directoryToCreatePath.exists() ) {
                        try {
                            Files.createDirectory(directoryToCreatePath)
                            response = ResponseEntity(HttpStatus.CREATED)
                        } catch(exc: IOException) {
                            println(exc)
                            response = ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR)
                        }
                    } else {
                        response = ResponseEntity("Folder already exists", HttpStatus.BAD_REQUEST)
                    }

                } else {
                    response = ResponseEntity(HttpStatus.FORBIDDEN)
                }

            } else {
                response = ResponseEntity("Folder name is invalid.", HttpStatus.BAD_REQUEST)
            }

        } else {
            response = ResponseEntity(HttpStatus.FORBIDDEN)
        }

        return response

    }

    @OptIn(ExperimentalPathApi::class)
    @DeleteMapping("/api/dir")
    fun deleteDirectory(
        @RequestParam( name = "pathtofolder", required = true ) path: String,
        @RequestParam( name = "recursively", required = false ) deleteRecursively: Boolean?
    ): ResponseEntity<String> {

        val authentication = SecurityContextHolder.getContext().authentication
        lateinit var response: ResponseEntity<String>

        if( authentication !is AnonymousAuthenticationToken ) {

            val baseDirectoryString = "storage/" + authentication.name
            val baseDirectoryPath = Path(baseDirectoryString)

            val directoryToDeleteString = baseDirectoryString + if(path.startsWith("/")) path else "/$path"
            val directoryToDeletePath = Path(directoryToDeleteString)

            if( verifyPathTraversing(baseDirectoryPath, directoryToDeletePath) ) {

                if( directoryToDeletePath.exists() && directoryToDeletePath.isDirectory() ) {

                    if( deleteRecursively == null || !deleteRecursively ) {
                        try {
                            directoryToDeletePath.deleteExisting()
                            response = ResponseEntity(HttpStatus.OK)
                        } catch(exc: DirectoryNotEmptyException) {
                            response = ResponseEntity("Folder is not empty.", HttpStatus.BAD_REQUEST)
                        }
                    } else {
                        directoryToDeletePath.deleteRecursively()
                        response = ResponseEntity(HttpStatus.OK)
                    }

                } else {
                    response = ResponseEntity("Folder not found.", HttpStatus.NOT_FOUND)
                }

            } else {
                response = ResponseEntity(HttpStatus.FORBIDDEN)
            }

        } else {
            response = ResponseEntity(HttpStatus.FORBIDDEN)
        }

        return response

    }

    @PostMapping("/api/file")
    fun uploadFile(
        session: HttpSession,
        @RequestParam( name = "dir", required = true ) dir: String,
        @RequestParam( name = "file", required = true ) file: MultipartFile
    ): ResponseEntity<String> {

        val authentication = SecurityContextHolder.getContext().authentication
        lateinit var response: ResponseEntity<String>

        if( authentication !is AnonymousAuthenticationToken ) {

            val baseDirectoryString = "storage/" + authentication.name
            val baseDirectoryPath = Path(baseDirectoryString)

            val workingDirectoryString = baseDirectoryString + if(dir.startsWith("/")) dir else "/$dir"
            val workingDirectoryPath = Path(workingDirectoryString)

            if( verifyPathTraversing(baseDirectoryPath, workingDirectoryPath) ) {

                val fileToUploadString = "$workingDirectoryPath/${file.originalFilename}"
                val fileToUploadPath = Path( fileToUploadString )

                if( !fileToUploadPath.exists() ) {

                    val fileToUpload = fileToUploadPath.toFile()

                    val sessionId = session.id
                    val user = userRepository.getUserByUsername( authentication.name )!!
                    val encryptionDetails = userEncryptionDetailsRepository.getEncryptionDetailsFromUserId( user.id!! )!!

                    try {

                        val salt = encryptionDetails.salt
                        val key = AESCryptUtils.getKeyFromPassword(sessionId, salt)

                        val encryptedToken = sessionEncryptionTokenManager.getSessionEncryptionToken(sessionId)!!
                        val rawToken = AESCryptUtils.decryptString(encryptedToken, key)

                        val encryptionKey = AESCryptUtils.getKeyFromPassword(rawToken, salt)

                        val inputStream = file.inputStream
                        val outputStream = fileToUpload.outputStream()

                        AESCryptUtils.encryptFile(encryptionKey, inputStream, outputStream)

                        response = ResponseEntity(HttpStatus.OK)

                    } catch( exc: BadPaddingException ) {
                        response = ResponseEntity("Couldn't upload file, encryption error.", HttpStatus.INTERNAL_SERVER_ERROR)
                    } catch( exc: IOException ) {
                        response = ResponseEntity("Couldn't upload file, input/output error.", HttpStatus.INTERNAL_SERVER_ERROR)
                    }

                } else {
                    response = ResponseEntity("File with same name already exists.", HttpStatus.BAD_REQUEST)
                }

            } else {
                response = ResponseEntity(HttpStatus.FORBIDDEN)
            }

        } else {
            response = ResponseEntity(HttpStatus.FORBIDDEN)
        }

        return response

    }

    @GetMapping("/api/file")
    fun downloadFile(
        session: HttpSession,
        servletResponse: HttpServletResponse,
        @RequestParam( name = "pathtofile", required = true ) pathToFile: String
    ): ResponseEntity<String> {

        val authentication = SecurityContextHolder.getContext().authentication
        lateinit var response: ResponseEntity<String>

        if( authentication !is AnonymousAuthenticationToken ) {

            val baseDirectoryString = "storage/" + authentication.name
            val baseDirectoryPath = Path(baseDirectoryString)

            val filePathString = baseDirectoryString + if(pathToFile.startsWith("/")) pathToFile else "/$pathToFile"
            val filePath = Path(filePathString)

            if( verifyPathTraversing(baseDirectoryPath, filePath) ) {

                val file = filePath.toFile()

                if( file.exists() ) {

                    if( file.isFile ) {

                        val sessionId = session.id
                        val user = userRepository.getUserByUsername(authentication.name)!!
                        val encryptionDetails = userEncryptionDetailsRepository.getEncryptionDetailsFromUserId(user.id!!)!!

                        try {

                            val inputStream = file.inputStream()
                            val outputStream = servletResponse.outputStream

                            val salt = encryptionDetails.salt
                            val key = AESCryptUtils.getKeyFromPassword(sessionId, salt)

                            val encryptedToken = sessionEncryptionTokenManager.getSessionEncryptionToken(sessionId)!!
                            val rawToken = AESCryptUtils.decryptString(encryptedToken, key)
                            val encryptionKey = AESCryptUtils.getKeyFromPassword(rawToken, salt)

                            servletResponse.setHeader("Content-Disposition", "attachment; filename=" + file.name)
                            AESCryptUtils.decryptFile(encryptionKey, inputStream, outputStream)

                            response = ResponseEntity(HttpStatus.OK)

                        } catch(exc: BadPaddingException) {
                            response = ResponseEntity("Couldn't download file, encryption error.", HttpStatus.INTERNAL_SERVER_ERROR)
                        }

                    } else {
                        response = ResponseEntity("Path points to folder.", HttpStatus.BAD_REQUEST)
                    }

                } else {
                    response = ResponseEntity(HttpStatus.NOT_FOUND)
                }

            } else {
                response = ResponseEntity(HttpStatus.FORBIDDEN)
            }

        } else {
            response = ResponseEntity(HttpStatus.FORBIDDEN)
        }

        return response

    }

    @PostMapping("/api/file/copy")
    fun duplicateFile(
        @RequestParam( name = "pathtofile", required = true ) pathToFile: String
    ): ResponseEntity<String> {

        val authentication = SecurityContextHolder.getContext().authentication
        lateinit var response: ResponseEntity<String>

        if( authentication !is AnonymousAuthenticationToken ) {

            val baseDirectoryString = "storage/" + authentication.name
            val baseDirectoryPath = Path(baseDirectoryString)

            val filePathString = baseDirectoryString + if(pathToFile.startsWith("/")) pathToFile else "/$pathToFile"
            val filePath = Path(filePathString)

            if( verifyPathTraversing(baseDirectoryPath, filePath) ) {

                if( !filePath.isDirectory() ) {

                    try {

                        val file = filePath.toFile()

                        val destinationFile = File("${file.parent}/Copy of ${file.name}")
                        file.copyTo(destinationFile, true)

                        response = ResponseEntity(HttpStatus.OK)

                    } catch(exc: NoSuchFileException) {
                        response = ResponseEntity("File to be copied not found.", HttpStatus.NOT_FOUND)
                    }

                } else {
                    response = ResponseEntity("Path leads to folder.", HttpStatus.BAD_REQUEST)
                }

            } else {
                response = ResponseEntity(HttpStatus.FORBIDDEN)
            }

        } else {
            response = ResponseEntity(HttpStatus.FORBIDDEN)
        }

        return response

    }

    @DeleteMapping("/api/file")
    fun deleteFile(
        @RequestParam( name = "pathtofile", required = true ) pathToFile: String
    ): ResponseEntity<String> {

        val authentication = SecurityContextHolder.getContext().authentication
        lateinit var response: ResponseEntity<String>

        if( authentication !is AnonymousAuthenticationToken ) {

            val baseDirectoryString = "storage/" + authentication.name
            val baseDirectoryPath = Path(baseDirectoryString)

            val filePathString = baseDirectoryString + if(pathToFile.startsWith("/")) pathToFile else "/$pathToFile"
            val filePath = Path(filePathString)

            if( verifyPathTraversing(baseDirectoryPath, filePath) ) {

                if( !filePath.isDirectory() ) {

                    if( filePath.deleteIfExists() ) {
                        response = ResponseEntity(HttpStatus.OK)
                    } else {
                        response = ResponseEntity("File does not exist.", HttpStatus.NOT_FOUND)
                    }

                } else {
                    response = ResponseEntity("Path leads to directory.", HttpStatus.BAD_REQUEST)
                }

            } else {
                response = ResponseEntity(HttpStatus.FORBIDDEN)
            }

        } else {
            response = ResponseEntity(HttpStatus.FORBIDDEN)
        }

        return response

    }

    @PatchMapping("/api/entry")
    fun renameEntry(
        @RequestParam( "pathtoentry", required = true ) path: String,
        @RequestParam( "newname", required = true ) newName: String
    ): ResponseEntity<String> {

        val authentication = SecurityContextHolder.getContext().authentication
        lateinit var response: ResponseEntity<String>

        if( authentication !is AnonymousAuthenticationToken ) {

            if( !newName.contains( Regex("""#%&\{}<>*?/\$!'\\":@+`|=""") ) ) {

                val baseDirectoryString = "storage/" + authentication.name
                val baseDirectoryPath = Path(baseDirectoryString)

                val filePathString = baseDirectoryString + if(path.startsWith("/")) path else "/$path"
                val filePath = Path(filePathString)

                if( verifyPathTraversing(baseDirectoryPath, filePath) ) {

                    val newPathnameString = "${filePath.parent}/$newName"
                    val newNamePath = Path(newPathnameString)

                    if( filePath.toFile().renameTo( newNamePath.toFile() ) ) {
                        response = ResponseEntity(HttpStatus.OK)
                    } else {
                        response = ResponseEntity("Couldn't rename entry.", HttpStatus.INTERNAL_SERVER_ERROR)
                    }

                } else {
                    response = ResponseEntity(HttpStatus.FORBIDDEN)
                }

            } else {
                response = ResponseEntity("New name is invalid.", HttpStatus.BAD_REQUEST)
            }

        } else {
            response = ResponseEntity(HttpStatus.FORBIDDEN)
        }

        return response

    }

}