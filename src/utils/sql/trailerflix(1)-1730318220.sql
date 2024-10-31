CREATE TABLE IF NOT EXISTS `contenido` (
	`id` int AUTO_INCREMENT NOT NULL,
	`poster` varchar(255) NOT NULL,
	`titulo` varchar(255) NOT NULL,
	`resumen` text NOT NULL,
	`temporadas` varchar(20) NOT NULL,
	`trailer` varchar(255) NOT NULL,
	`duracion` VARCHAR(50),
	PRIMARY KEY (`id`)
);

ALTER TABLE `contenido`
ADD `categoria` enum('Serie','Película');

CREATE TABLE IF NOT EXISTS `genero` (
	`id` int AUTO_INCREMENT NOT NULL,
	`genre_name` varchar(50) NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `actor` (
	`id` int AUTO_INCREMENT NOT NULL,
	`first_name` varchar(50) NOT NULL,
	`last_name` varchar(50) NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `contenido_genero` (
	`contenido_id` int NOT NULL,
	`genero_id` int NOT NULL,
	PRIMARY KEY (`contenido_id`, `genero_id`)
);

CREATE TABLE IF NOT EXISTS `contenido_actor` (
	`contenido_id` int NOT NULL,
	`actor_id` int NOT NULL,
	PRIMARY KEY (`contenido_id`, `actor_id`)
);




ALTER TABLE `contenido_genero` ADD CONSTRAINT `contenido_genero_fk0` FOREIGN KEY (`contenido_id`) REFERENCES `contenido`(`id`);

ALTER TABLE `contenido_genero` ADD CONSTRAINT `contenido_genero_fk1` FOREIGN KEY (`genero_id`) REFERENCES `genero`(`id`);
ALTER TABLE `contenido_actor` ADD CONSTRAINT `contenido_actor_fk0` FOREIGN KEY (`contenido_id`) REFERENCES `contenido`(`id`);

ALTER TABLE `contenido_actor` ADD CONSTRAINT `contenido_actor_fk1` FOREIGN KEY (`actor_id`) REFERENCES `actor`(`id`);