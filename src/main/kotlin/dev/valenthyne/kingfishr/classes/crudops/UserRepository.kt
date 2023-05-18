package dev.valenthyne.kingfishr.classes.crudops

import dev.valenthyne.kingfishr.classes.crudops.models.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface UserRepository : JpaRepository<User, Long> {

    @Query("SELECT * from USERS WHERE username = :username", nativeQuery = true)
    fun getUserByUsername( @Param( "username" ) username : String ) : User?

}