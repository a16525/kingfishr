package dev.valenthyne.kingfishr.classes.crudops

import org.springframework.data.jpa.repository.JpaRepository

interface UserRepository : JpaRepository<User, Long>