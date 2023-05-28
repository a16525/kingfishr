package dev.valenthyne.kingfishr.classes.crudops.models

import jakarta.persistence.*

@Entity
@Table( name = "USER_ENCRYPTION_DETAILS" )
class UserEncryptionDetails (

    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    var id: Long? = null,

    @Column( nullable = false, length = 512 )
    var token: String,

    @Column( nullable = false )
    var salt: ByteArray,

    @Column( nullable = false )
    var iv: ByteArray,

    @Column( nullable = false )
    var chv: String,

    @OneToOne( cascade = [ CascadeType.MERGE, CascadeType.REMOVE ])
    @JoinColumn( name = "user_id", referencedColumnName = "id" )
    var user: User

)