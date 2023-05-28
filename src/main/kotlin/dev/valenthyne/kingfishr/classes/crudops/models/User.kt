package dev.valenthyne.kingfishr.classes.crudops.models

import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import java.util.Date

@Entity
@Table(name = "USERS")
class User (

    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    var id: Long? = null,

    @Column( nullable = false, unique = true, length = 64 )
    var username: String,

    @Column( nullable = false, length = 1024 )
    var password: String,

    @CreationTimestamp
    var timestampCreated: Date,

    @Column( nullable = false )
    var isConfigurator: Boolean = false

)