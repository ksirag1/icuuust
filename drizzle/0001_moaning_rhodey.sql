CREATE TABLE `buildingElements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`layoutId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('room','auditorium','stairs','corridor','toilet','utility','office') NOT NULL,
	`x` int NOT NULL,
	`y` int NOT NULL,
	`width` int NOT NULL,
	`height` int NOT NULL,
	`floor` int NOT NULL DEFAULT 1,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `buildingElements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `buildingLayouts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`buildingId` int NOT NULL,
	`buildingName` varchar(255) NOT NULL,
	`width` int NOT NULL,
	`height` int NOT NULL,
	`gridSize` int NOT NULL DEFAULT 20,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `buildingLayouts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `buildingPolygons` (
	`id` int AUTO_INCREMENT NOT NULL,
	`buildingId` int NOT NULL,
	`buildingName` varchar(255) NOT NULL,
	`coordinates` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `buildingPolygons_id` PRIMARY KEY(`id`)
);
