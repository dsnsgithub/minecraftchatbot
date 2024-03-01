import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	username: text("username").unique().notNull(),
	deaths: integer("deaths").notNull(),
	kills: integer("kills").notNull()
});

export const messages = sqliteTable("messages", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	username: text("username").notNull(),
	message: text("message").notNull()
});