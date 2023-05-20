package dev.valenthyne.kingfishr.classes.crudops.models

class UserInfo( user: User ) {

    val id = user.id
    val username = user.username
    val isConfigurator = user.isConfigurator

}