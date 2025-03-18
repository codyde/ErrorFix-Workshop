CREATE TABLE `products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`price` real NOT NULL,
	`category` text NOT NULL,
	`featured` integer DEFAULT false NOT NULL,
	`in_stock` integer DEFAULT true NOT NULL,
	`rating` real,
	`review_count` integer DEFAULT 0,
	`images` text DEFAULT '[]' NOT NULL,
	`sizes` text DEFAULT '[]' NOT NULL,
	`colors` text DEFAULT '[]' NOT NULL
);
