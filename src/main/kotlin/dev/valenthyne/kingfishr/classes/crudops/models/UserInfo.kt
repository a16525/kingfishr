package dev.valenthyne.kingfishr.classes.crudops.models

class UserInfo( user: User ) {

    val id = user.id
    val username = user.username
    val storageUsed = 0
    val isConfigurator = user.isConfigurator

}