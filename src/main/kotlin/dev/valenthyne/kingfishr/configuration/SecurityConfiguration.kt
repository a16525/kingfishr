package dev.valenthyne.kingfishr.configuration

import dev.valenthyne.kingfishr.classes.CustomAuthenticationHandler
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.provisioning.InMemoryUserDetailsManager
import org.springframework.security.web.SecurityFilterChain

@Configuration
@EnableWebSecurity
class SecurityConfiguration {

    @Bean
    fun authSuccessHandler() : CustomAuthenticationHandler {
        return CustomAuthenticationHandler()
    }

    @Bean
    fun securityFilters( http : HttpSecurity ) : SecurityFilterChain {



        http
            .authorizeHttpRequests { requests ->
                requests
                    .requestMatchers( "/js/**", "/css/**", "/webjars/**", "/favicon.ico" ).permitAll()  // Resources
                    .requestMatchers( "/api/**" ).authenticated()                                        // API access

                    .requestMatchers( "/login**" ).permitAll()

                    .requestMatchers( "/", "index" ).hasRole( "USER" )                             // Interface
                    .requestMatchers( "/config" ).hasRole( "ADMIN" )                               // Configurator page
            }
            .formLogin { form ->
                form
                    .loginPage( "/login" ).permitAll()
                    .successHandler( authSuccessHandler() )
            }
            .logout { logout -> logout.permitAll() }
            .sessionManagement { session ->
                session
                    .invalidSessionUrl( "/login?expired" )
                    .maximumSessions( 1 )
                    .expiredUrl( "/login?expired" )
            }

        http.csrf().ignoringRequestMatchers( "/api**" ).disable()

        return http.build()

    }

        // Testing accounts
    @Bean
    fun userDetails() : UserDetailsService {

        val user1 : UserDetails = User.withDefaultPasswordEncoder()
            .username( "user1" )
            .password( "password" )
            .roles( "USER" )
            .build()

        val user2 : UserDetails = User.withDefaultPasswordEncoder()
            .username( "user2" )
            .password( "password" )
            .roles( "USER" )
            .build()

        val configurator : UserDetails = User.withDefaultPasswordEncoder()
            .username( "configurator" )
            .password( "password" )
            .roles( "ADMIN" )
            .build()

        return InMemoryUserDetailsManager( user1, user2, configurator )

    }

}