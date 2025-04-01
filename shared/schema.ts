import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Original user schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Children schema
export const children = pgTable("children", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  nickname: text("nickname"),
  avatarUrl: text("avatar_url"),
  classroom: text("classroom").notNull(),
  birthDate: text("birth_date"),
});

export const insertChildSchema = createInsertSchema(children).pick({
  firstName: true,
  lastName: true,
  nickname: true,
  avatarUrl: true,
  classroom: true,
  birthDate: true,
});

export type InsertChild = z.infer<typeof insertChildSchema>;
export type Child = typeof children.$inferSelect;

// Activity Posts schema
export const activityPosts = pgTable("activity_posts", {
  id: serial("id").primaryKey(),
  classroom: text("classroom").notNull(),
  date: text("date").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  childId: integer("child_id").notNull(),
  author: text("author").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertActivitySchema = createInsertSchema(activityPosts).pick({
  classroom: true,
  date: true,
  content: true,
  imageUrl: true,
  childId: true,
  author: true,
});

export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type ActivityPost = typeof activityPosts.$inferSelect;

// Comments schema
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  activityId: integer("activity_id").notNull(),
  author: text("author").notNull(),
  authorImage: text("author_image"),
  date: text("date").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCommentSchema = createInsertSchema(comments).pick({
  activityId: true,
  author: true,
  authorImage: true,
  date: true,
  content: true,
});

export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;

// Contacts schema
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  avatarUrl: text("avatar_url"),
});

export const insertContactSchema = createInsertSchema(contacts).pick({
  name: true,
  role: true,
  email: true,
  phone: true,
  avatarUrl: true,
});

export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;
