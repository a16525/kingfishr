package dev.valenthyne.kingfishr.classes

import java.io.File

class KFGenericDataEntry {

    var name: String private set
    var type: String private set
    var size: Long   private set
    var pathTo: String private set

    constructor( file: File, pathTo: String ) {

        this.name = file.name
        this.type = file.extension
        this.size = file.length()
        this.pathTo = pathTo

    }

    constructor( name: String, type: String, size: Long, pathTo: String ) {

        this.name = name
        this.type = type
        this.size = size
        this.pathTo = pathTo

    }

}