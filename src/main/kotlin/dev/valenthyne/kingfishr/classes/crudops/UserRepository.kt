package dev.valenthyne.kingfishr.classes.crudops

import dev.valenthyne.kingfishr.classes.models.User
import org.springframework.data.jpa.repository.JpaRepository

interface UserRepository : JpaRepository<User, Long>