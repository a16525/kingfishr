package dev.valenthyne.kingfishr.classes.crudops

import jakarta.persistence.*

@Entity
@Table(name="users")

class User (

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long,

    @Column(nullable = false, unique = true, length = 64)
    var username: String,

    @Column(nullable = false, length = 1024)
    var password: String

)