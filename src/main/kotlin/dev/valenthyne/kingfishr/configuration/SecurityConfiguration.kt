package dev.valenthyne.kingfishr.configuration

import dev.valenthyne.kingfishr.classes.CustomAuthenticationHandler
import dev.valenthyne.kingfishr.classes.CustomUserDetailsService
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.authentication.AuthenticationProvider
import org.springframework.security.authentication.dao.DaoAuthenticationProvider
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.web.SecurityFilterChain

@Configuration
@EnableWebSecurity
class SecurityConfiguration {

    @Bean
    fun authSuccessHandler(): CustomAuthenticationHandler {
        return CustomAuthenticationHandler()
    }

    @Bean
    fun userDetailsService(): UserDetailsService {
        return CustomUserDetailsService()
    }

    @Bean
    fun passwordEncoder(): BCryptPasswordEncoder {
        return BCryptPasswordEncoder()
    }

    @Bean
    fun authenticationProvider(): AuthenticationProvider {

        val authProvider = DaoAuthenticationProvider()
        authProvider.setUserDetailsService( userDetailsService() )
        authProvider.setPasswordEncoder( passwordEncoder() )

        return authProvider

    }

    @Bean
    fun securityFilterChain( http: HttpSecurity ): SecurityFilterChain {

        http
            .authorizeHttpRequests { requests ->
                requests
                    .requestMatchers( "/js/**", "/css/**", "/webjars/**", "/favicon.ico" ).permitAll()   // Resources
                    .requestMatchers( "/api/**" ).authenticated()                                        // API access

                    .requestMatchers( "/login**", "/logout" ).permitAll()

                    .requestMatchers( "/", "index" ).hasRole( "USER" )                             // Interface
                    .requestMatchers( "/config" ).hasRole( "ADMIN" )                               // Configurator page
            }
            .formLogin { form ->
                form
                    .loginPage( "/login" ).permitAll()
                    .successHandler( authSuccessHandler() )
            }
            .logout { logout ->
                logout
                    .clearAuthentication( true )
                    .deleteCookies( "JSESSIONID" )
                    .logoutUrl( "/logout" )
                    .logoutSuccessUrl( "/login?logout" )
            }
            .sessionManagement { session ->
                session
                    .invalidSessionUrl( "/login?expired" )
                    .maximumSessions( 1 )
                    .expiredUrl( "/login?logout" )
            }

        http.csrf().ignoringRequestMatchers( "/api/**" ).disable()
        http.authenticationProvider( authenticationProvider() )

        return http.build()

    }

}