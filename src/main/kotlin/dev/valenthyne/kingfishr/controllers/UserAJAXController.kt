package dev.valenthyne.kingfishr.controllers


import com.fasterxml.jackson.databind.ObjectMapper
import dev.valenthyne.kingfishr.classes.KFGenericDataEntry
import org.apache.tika.Tika
import org.springframework.core.io.InputStreamResource
import org.springframework.http.*
import org.springframework.security.authentication.AnonymousAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.multipart.MultipartFile
import java.io.File
import java.io.FileInputStream
import java.io.IOException
import java.nio.file.DirectoryNotEmptyException
import java.nio.file.Files
import java.nio.file.NoSuchFileException
import kotlin.io.path.*

@Controller
class UserAJAXController {

    @GetMapping( "/api/dir/contents" )
    fun listFiles( @RequestParam( name = "dir", required = true ) dir: String ): ResponseEntity<String> {

        val auth : Authentication = SecurityContextHolder.getContext().authentication
        lateinit var response : ResponseEntity<String>

        if( auth is AnonymousAuthenticationToken ) {
            response = ResponseEntity( HttpStatus.FORBIDDEN )
        } else {

            val baseUserDirectory = "storage/" + auth.name
            val baseUserPath = Path( baseUserDirectory )

            val currentDirectory = Path( baseUserDirectory, dir )

            if( currentDirectory.exists() ) {

                val paths = currentDirectory.listDirectoryEntries()
                val entries : MutableList<KFGenericDataEntry> = mutableListOf()

                for( path in paths ) {

                    val relativePath = path.relativeTo( baseUserPath ).pathString
                    lateinit var entry : KFGenericDataEntry

                    if( path.isDirectory() ) {

                        entry = KFGenericDataEntry( path.nameWithoutExtension, "dir", -1, relativePath )
                        entries.add( entry )

                    } else {

                        entry = KFGenericDataEntry( path.toFile(), relativePath )
                        entries.add( entry )

                    }

                }

                val jsonWriter = ObjectMapper().writer()
                val entriesJSON = jsonWriter.writeValueAsString( entries )

                val headers = HttpHeaders()
                headers.contentType = MediaType.APPLICATION_JSON

                response = ResponseEntity( entriesJSON, headers, HttpStatus.OK )

            } else {
                response = ResponseEntity( "Folder not found", HttpStatus.NOT_FOUND )
            }

        }

        return response

    }

    @PostMapping( "/api/dir" )
    fun createDirectory( @RequestParam( name = "dir", required = true ) dir: String,
                         @RequestParam( name = "dirname", required = true ) dirname: String ): ResponseEntity<String> {

        val auth : Authentication = SecurityContextHolder.getContext().authentication
        lateinit var response: ResponseEntity<String>

        if( auth is AnonymousAuthenticationToken) {
            response = ResponseEntity( HttpStatus.FORBIDDEN )
        } else {

            val baseUserDirectory = "storage/" + auth.name
            val currentDirectory = Path( baseUserDirectory, dir )

            val directoryGoal = Path( "$currentDirectory/$dirname" )

            if( directoryGoal.exists() ) {
                response = ResponseEntity( "Folder already exists", HttpStatus.BAD_REQUEST )
            } else {

                try {

                    Files.createDirectory( directoryGoal )
                    response = ResponseEntity( HttpStatus.CREATED )

                } catch( exc : IOException ) {
                    println( exc.message )
                    response = ResponseEntity( HttpStatus.INTERNAL_SERVER_ERROR )
                }

            }

        }

        return response

    }

    @OptIn(ExperimentalPathApi::class)
    @DeleteMapping( "/api/dir" )
    fun deleteDirectory( @RequestParam( name = "pathtofolder", required = true ) pathtoDir: String,
                         @RequestParam( name = "recursively", required = false ) deleteRecursively: Boolean? ): ResponseEntity<String> {

        val auth : Authentication = SecurityContextHolder.getContext().authentication
        lateinit var response: ResponseEntity<String>

        if( auth is AnonymousAuthenticationToken) {
            response = ResponseEntity( HttpStatus.FORBIDDEN )
        } else {

            val fullPath = Path("storage/${auth.name}/${pathtoDir}" )

            if( fullPath.exists() && fullPath.isDirectory() ) {

                if( deleteRecursively == null || ! deleteRecursively ) {

                    try {
                        fullPath.deleteExisting()
                        response = ResponseEntity( HttpStatus.OK )
                    } catch( exc: DirectoryNotEmptyException ) {
                        response = ResponseEntity( "Folder is not empty.", HttpStatus.BAD_REQUEST )
                    }

                } else {

                    fullPath.deleteRecursively()
                    response = ResponseEntity(HttpStatus.OK)

                }

            } else {
                response = ResponseEntity( "Folder not found.", HttpStatus.NOT_FOUND )
            }

        }

        return response

    }

    @PostMapping( "/api/file" )
    fun uploadFile(@RequestParam( name = "dir", required = true ) dir: String,
                   @RequestParam( name = "file", required = true ) file: MultipartFile ): ResponseEntity<String> {

        val auth : Authentication = SecurityContextHolder.getContext().authentication
        lateinit var response : ResponseEntity<String>

        if( auth is AnonymousAuthenticationToken ) {
            response = ResponseEntity( HttpStatus.FORBIDDEN )
        } else {

            val baseUserDirectory = "storage/" + auth.name
            val currentDirectory = Path( baseUserDirectory, dir )

            val directoryGoal = Path( "$currentDirectory/${file.originalFilename}" )

            if( directoryGoal.exists() ) {
                response = ResponseEntity( "File with same name already exists on server", HttpStatus.BAD_REQUEST )
            } else {

                try {

                    file.transferTo( directoryGoal )
                    response = ResponseEntity( HttpStatus.CREATED )

                } catch( exc : IOException ) {
                    println( exc.message )
                    response = ResponseEntity( HttpStatus.INTERNAL_SERVER_ERROR )
                }

            }

        }

        return response

    }

    @GetMapping( "/api/file" )
    fun downloadFile( @RequestParam( name = "pathtofile", required = true ) pathToFile: String ): ResponseEntity<Any> {

        val auth : Authentication = SecurityContextHolder.getContext().authentication
        lateinit var response: ResponseEntity<Any>

        if( auth is AnonymousAuthenticationToken ) {
            response = ResponseEntity( HttpStatus.FORBIDDEN )
        } else {

            val baseUserDirectory = "storage/" + auth.name
            val targetFile = Path(baseUserDirectory, pathToFile).toFile()

            if(! targetFile.exists()) {
                response = ResponseEntity(HttpStatus.NOT_FOUND)
            } else {

                if(! targetFile.isFile) {
                    response = ResponseEntity("Path leads to directory", HttpStatus.BAD_REQUEST)
                } else {

                    val resource = InputStreamResource(FileInputStream(targetFile))
                    val headers = HttpHeaders()

                    headers.contentType = try {
                        MediaType.parseMediaType(Tika().detect(targetFile))
                    } catch(exc : InvalidMediaTypeException) {
                        MediaType.APPLICATION_OCTET_STREAM
                    }

                    headers.contentLength = targetFile.length()
                    headers.set("Content-disposition", "attachment; filename=" + targetFile.name)

                    response = ResponseEntity(resource, headers, HttpStatus.OK)

                }

            }

        }

        return response

    }

    @PostMapping( "/api/file/copy" )
    fun duplicateFile( @RequestParam( name = "pathtofile", required = true ) pathToFile : String ): ResponseEntity<String> {

        val auth : Authentication = SecurityContextHolder.getContext().authentication
        lateinit var response: ResponseEntity<String>

        if( auth is AnonymousAuthenticationToken) {
            response = ResponseEntity( HttpStatus.FORBIDDEN )
        } else {

            val path = Path("storage/${auth.name}/${pathToFile}" )

            if( path.isDirectory() ) {
                response = ResponseEntity( "Path provided leads to a folder", HttpStatus.BAD_REQUEST )
            } else {

                try {

                    val filePath = path.toFile()

                    val destinationFile = File("${filePath.parent}/Copy of ${filePath.name}")
                    filePath.copyTo( destinationFile, true )

                    response = ResponseEntity(HttpStatus.OK)

                } catch(exc : NoSuchFileException) {
                    response = ResponseEntity("Source file not found", HttpStatus.NOT_FOUND)
                }

            }

        }

        return response

    }

    @DeleteMapping( "/api/file" )
    fun deleteFile( @RequestParam( name = "pathtofile", required = true ) pathToFile : String ): ResponseEntity<String> {

        val auth : Authentication = SecurityContextHolder.getContext().authentication
        lateinit var response: ResponseEntity<String>

        if( auth is AnonymousAuthenticationToken) {
            response = ResponseEntity( HttpStatus.FORBIDDEN )
        } else {

            val fullPath = Path("storage/${auth.name}/${pathToFile}" )

            if( fullPath.deleteIfExists() ) {
                response = ResponseEntity( HttpStatus.OK )
            } else {
                response = ResponseEntity( "The file does not exist.", HttpStatus.NOT_FOUND )
            }

        }

        return response

    }

    @PatchMapping( "/api/entry" )
    fun renameEntry( @RequestParam( "pathtoentry", required = true ) pathToEntry: String,
                     @RequestParam( "newname", required = true ) newName : String ): ResponseEntity<String> {

        val auth : Authentication = SecurityContextHolder.getContext().authentication
        lateinit var response: ResponseEntity<String>

        if( auth is AnonymousAuthenticationToken) {
            response = ResponseEntity( HttpStatus.FORBIDDEN )
        } else
        if( newName.contains( Regex( """#%&\{}<>*?/\$!'\\":@+`|=""" ) ) ) {
            response = ResponseEntity( "New name is invalid.", HttpStatus.BAD_REQUEST )
        } else {

            val fullPath = Path("storage/${auth.name}/${pathToEntry}" ).toFile()

            if( fullPath.exists() ) {

                val newPath = Path( "${fullPath.parent}/$newName" ).toFile()
                fullPath.renameTo( newPath )

                response = ResponseEntity( HttpStatus.OK )

            } else {
                response = ResponseEntity( "Entry doesn't exist.", HttpStatus.NOT_FOUND )
            }

        }

        return response

    }

}