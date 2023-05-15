package dev.valenthyne.kingfishr.controllers

import dev.valenthyne.kingfishr.configuration.WebjarVersions
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.GetMapping
import java.net.InetAddress
import java.net.UnknownHostException

@Controller
class HTMLController {

    fun addBaseAttributes( model : Model ) {

        model.addAttribute( "bootstrap_version", WebjarVersions.BOOTSTRAP_VERSION )
        model.addAttribute( "bootstrap_icons_version", WebjarVersions.BOOTSTRAP_ICONS_VERSION )

        try {

            val hostname : String = InetAddress.getLocalHost().hostName
            model.addAttribute( "hostname", hostname )

        } catch( exc : UnknownHostException ) {
            println( "Couldn't resolve hostname.\n" + exc.message )
        }

    }

    @GetMapping( "/" )
    fun root( model : Model ) : String {

        addBaseAttributes( model )
        return "index"

    }

    @GetMapping( "/index" )
    fun index( model : Model ) : String {
        return root( model )
    }

    @GetMapping( "login" )
    fun login( model : Model ) : String {

        addBaseAttributes( model )
        return "login"

    }

    @GetMapping( "/config" )
    fun config( model : Model ) : String {

        addBaseAttributes( model )
        return "config"

    }

}