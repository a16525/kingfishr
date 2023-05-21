package dev.valenthyne.kingfishr.classes.crudops.models

import jakarta.persistence.*

@Entity
@Table(name="USERS")
class User (

    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    var id: Long? = null,

    @Column( nullable = false, unique = true, length = 64 )
    var username: String,

    @Column( nullable = false, length = 1024 )
    var password: String,

    @Column( nullable = false )
    var isConfigurator: Boolean = false

)