import org.gradle.api.file.DuplicatesStrategy.EXCLUDE
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
	id("org.springframework.boot") version "3.0.6"
	id("io.spring.dependency-management") version "1.1.0"
	kotlin("jvm") version "1.7.22"
	kotlin("plugin.spring") version "1.7.22"
	kotlin("plugin.jpa") version "1.8.21"
}

group = "dev.valenthyne"
version = "0.1"
java.sourceCompatibility = JavaVersion.VERSION_17

repositories {
	mavenCentral()
}

dependencies {

	implementation("org.springframework.boot:spring-boot-starter-jdbc")
	implementation("org.springframework.boot:spring-boot-starter-security")
	implementation("org.springframework.boot:spring-boot-starter-thymeleaf")
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")

	implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
	implementation("org.jetbrains.kotlin:kotlin-reflect")
	implementation("org.thymeleaf.extras:thymeleaf-extras-springsecurity6")

	implementation("org.webjars:bootstrap:5.2.3")
	implementation("org.webjars.npm:bootstrap-icons:1.10.3")

	implementation("org.apache.tika:tika-core:2.7.0")

	developmentOnly("org.springframework.boot:spring-boot-devtools")

	runtimeOnly("com.h2database:h2")

	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testImplementation("org.springframework.security:spring-security-test")

}

tasks.withType<KotlinCompile> {
	kotlinOptions {
		freeCompilerArgs = listOf("-Xjsr305=strict")
		jvmTarget = "17"
	}
}

tasks.withType<Jar>() {
	duplicatesStrategy = EXCLUDE
}

tasks.withType<Test> {
	useJUnitPlatform()
}
