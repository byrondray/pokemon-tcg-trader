CREATE TABLE `conversations` (
	`id` text PRIMARY KEY NOT NULL,
	`listing_id` text NOT NULL,
	`initiator_id` text NOT NULL,
	`recipient_id` text NOT NULL,
	`status` text DEFAULT 'open',
	`last_message_at` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`listing_id`) REFERENCES `listings`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`initiator_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`recipient_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `conv_participants_idx` ON `conversations` (`initiator_id`,`recipient_id`);--> statement-breakpoint
CREATE TABLE `messages` (
	`id` text PRIMARY KEY NOT NULL,
	`conversation_id` text NOT NULL,
	`sender_id` text NOT NULL,
	`content` text NOT NULL,
	`read_at` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `msg_conversation_idx` ON `messages` (`conversation_id`);--> statement-breakpoint
CREATE TABLE `feedback` (
	`id` text PRIMARY KEY NOT NULL,
	`trade_agreement_id` text NOT NULL,
	`reviewer_id` text NOT NULL,
	`reviewed_user_id` text NOT NULL,
	`rating` integer NOT NULL,
	`comment` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`trade_agreement_id`) REFERENCES `trade_agreements`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`reviewer_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`reviewed_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `unique_review_idx` ON `feedback` (`trade_agreement_id`,`reviewer_id`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`tcg_pocket_id` text,
	`avatar_url` text,
	`reputation_score` real DEFAULT 0,
	`total_trades` integer DEFAULT 0,
	`created_at` integer NOT NULL,
	`last_active` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE INDEX `username_idx` ON `users` (`username`);--> statement-breakpoint
CREATE TABLE `listing_offers` (
	`listing_id` text NOT NULL,
	`card_id` text NOT NULL,
	`quantity` integer DEFAULT 1,
	PRIMARY KEY(`listing_id`, `card_id`),
	FOREIGN KEY (`listing_id`) REFERENCES `listings`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `listing_wants` (
	`listing_id` text NOT NULL,
	`card_id` text NOT NULL,
	`quantity` integer DEFAULT 1,
	PRIMARY KEY(`listing_id`, `card_id`),
	FOREIGN KEY (`listing_id`) REFERENCES `listings`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `listings` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`status` text DEFAULT 'active',
	`title` text,
	`description` text,
	`created_at` integer NOT NULL,
	`expires_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `listing_user_idx` ON `listings` (`user_id`);--> statement-breakpoint
CREATE INDEX `listing_status_idx` ON `listings` (`status`);--> statement-breakpoint
CREATE TABLE `trade_agreements` (
	`id` text PRIMARY KEY NOT NULL,
	`conversation_id` text NOT NULL,
	`proposer_id` text NOT NULL,
	`agreed_by_proposer` integer DEFAULT false,
	`agreed_by_recipient` integer DEFAULT false,
	`completed_at` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`proposer_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `wonder_picks` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`card_ids` text NOT NULL,
	`image_url` text,
	`expires_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `wonder_expires_idx` ON `wonder_picks` (`expires_at`);