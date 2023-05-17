package dev.valenthyne.kingfishr.classes.models

import jakarta.persistence.*

@Entity
@Table(name="USERS")

class User (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id : Long? = null,

    @Column(nullable = false, unique = true, length = 64)
    val username : String,

    @Column(nullable = false, length = 1024)
    val password : String ) {


}