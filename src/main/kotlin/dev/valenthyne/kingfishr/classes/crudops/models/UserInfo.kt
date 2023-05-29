package dev.valenthyne.kingfishr.classes.crudops.models

class UserInfo( user: User, storageUsed: Long? ) {

    val id = user.id
    val username = user.username
    val storageUsed = if( storageUsed == null || storageUsed < 0 ) 0 else storageUsed
    val timestampCreated = user.timestampCreated
    val isConfigurator = user.isConfigurator

}