package dev.valenthyne.kingfishr.classes.crudops

import dev.valenthyne.kingfishr.classes.crudops.models.UserEncryptionDetails
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface UserEncryptionDetailsRepository: JpaRepository<UserEncryptionDetails, Long> {

    @Query( "SELECT * FROM USER_ENCRYPTION_DETAILS WHERE user_id=:id", nativeQuery = true )
    fun getEncryptionDetailsFromUserId( @Param( "id" ) id: Long ): UserEncryptionDetails?

}