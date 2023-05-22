package dev.valenthyne.kingfishr.classes.crudops.models

class UserInfo( user: User ) {

    val id = user.id
    val username = user.username
    val storageUsed = 0
    val timestampCreated = user.timestampCreated
    val isConfigurator = user.isConfigurator

}