/**
 * TWIN AI - Database Schema
 * AI-Powered Digital Twin of India's Climate
 * Complete PostgreSQL schema with Drizzle ORM
 */
import {
  pgTable,
  text,
  varchar,
  integer,
  real,
  boolean,
  timestamp,
  uuid,
  jsonb,
  serial,
} from "drizzle-orm/pg-core";

/* ─────────────────────────── USERS & AUTH ─────────────────────────── */

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("citizen"),
  language: varchar("language", { length: 20 }).notNull().default("en"),
  state: varchar("state", { length: 100 }),
  district: varchar("district", { length: 100 }),
  avatarUrl: text("avatar_url"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  action: varchar("action", { length: 100 }).notNull(),
  resource: varchar("resource", { length: 100 }),
  details: jsonb("details"),
  ipAddress: varchar("ip_address", { length: 45 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* ─────────────────────────── STATES & DISTRICTS ─────────────────────────── */

export const states = pgTable("states", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  code: varchar("code", { length: 10 }).notNull().unique(),
  capital: varchar("capital", { length: 100 }),
  population: integer("population"),
  area: real("area"),
  lat: real("lat"),
  lng: real("lng"),
  regionType: varchar("region_type", { length: 50 }),
});

export const districts = pgTable("districts", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  stateId: integer("state_id").references(() => states.id),
  population: integer("population"),
  area: real("area"),
  lat: real("lat"),
  lng: real("lng"),
  soilType: varchar("soil_type", { length: 100 }),
  climateZone: varchar("climate_zone", { length: 100 }),
});

/* ─────────────────────────── CLIMATE DATA ─────────────────────────── */

export const climateData = pgTable("climate_data", {
  id: serial("id").primaryKey(),
  stateId: integer("state_id").references(() => states.id),
  districtId: integer("district_id").references(() => districts.id),
  temperature: real("temperature"),
  humidity: real("humidity"),
  rainfall: real("rainfall"),
  windSpeed: real("wind_speed"),
  windDirection: varchar("wind_direction", { length: 10 }),
  pressure: real("pressure"),
  aqi: integer("aqi"),
  uvIndex: real("uv_index"),
  visibility: real("visibility"),
  cloudCover: integer("cloud_cover"),
  condition: varchar("condition", { length: 50 }),
  recordedAt: timestamp("recorded_at").notNull().defaultNow(),
});

/* ─────────────────────────── ALERTS ─────────────────────────── */

export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 50 }).notNull(),
  severity: varchar("severity", { length: 20 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  stateId: integer("state_id").references(() => states.id),
  districtId: integer("district_id").references(() => districts.id),
  recommendations: jsonb("recommendations"),
  affectedPopulation: integer("affected_population"),
  isActive: boolean("is_active").notNull().default(true),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* ─────────────────────────── AGRICULTURE ─────────────────────────── */

export const crops = pgTable("crops", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  category: varchar("category", { length: 50 }),
  season: varchar("season", { length: 50 }),
  sowingMonth: varchar("sowing_month", { length: 20 }),
  harvestMonth: varchar("harvest_month", { length: 20 }),
  waterRequirement: varchar("water_requirement", { length: 50 }),
  soilTypes: jsonb("soil_types"),
  idealTemp: jsonb("ideal_temp"),
  msp: real("msp"),
  yieldPerHectare: real("yield_per_hectare"),
});

export const cropDistribution = pgTable("crop_distribution", {
  id: serial("id").primaryKey(),
  cropId: integer("crop_id").references(() => crops.id),
  stateId: integer("state_id").references(() => states.id),
  districtId: integer("district_id").references(() => districts.id),
  areaHectares: real("area_hectares"),
  production: real("production"),
  yield: real("yield"),
  season: varchar("season", { length: 50 }),
  year: integer("year"),
});

/* ─────────────────────────── PREDICTIONS ─────────────────────────── */

export const predictions = pgTable("predictions", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 50 }).notNull(),
  stateId: integer("state_id").references(() => states.id),
  districtId: integer("district_id").references(() => districts.id),
  value: real("value"),
  confidence: real("confidence"),
  unit: varchar("unit", { length: 30 }),
  metadata: jsonb("metadata"),
  predictedFor: timestamp("predicted_for"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* ─────────────────────────── SIMULATIONS ─────────────────────────── */

export const simulations = pgTable("simulations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  parameters: jsonb("parameters"),
  results: jsonb("results"),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  stateId: integer("state_id").references(() => states.id),
  districtId: integer("district_id").references(() => districts.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* ─────────────────────────── CHAT / AI ─────────────────────────── */

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  role: varchar("role", { length: 20 }).notNull(),
  content: text("content").notNull(),
  language: varchar("language", { length: 20 }),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* ─────────────────────────── REPORTS ─────────────────────────── */

export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  stateId: integer("state_id").references(() => states.id),
  districtId: integer("district_id").references(() => districts.id),
  content: jsonb("content"),
  format: varchar("format", { length: 10 }),
  status: varchar("status", { length: 20 }).notNull().default("generating"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* ─────────────────────────── GOVERNMENT SCHEMES ─────────────────────────── */

export const governmentSchemes = pgTable("government_schemes", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  ministry: varchar("ministry", { length: 255 }),
  category: varchar("category", { length: 50 }),
  description: text("description"),
  eligibility: text("eligibility"),
  benefits: text("benefits"),
  link: text("link"),
  isActive: boolean("is_active").notNull().default(true),
});

/* ─────────────────────────── DISASTER EVENTS ─────────────────────────── */

export const disasterEvents = pgTable("disaster_events", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 50 }).notNull(),
  severity: varchar("severity", { length: 20 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  stateId: integer("state_id").references(() => states.id),
  districtId: integer("district_id").references(() => districts.id),
  lat: real("lat"),
  lng: real("lng"),
  affectedArea: real("affected_area"),
  affectedPopulation: integer("affected_population"),
  economicLoss: real("economic_loss"),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  startedAt: timestamp("started_at"),
  endedAt: timestamp("ended_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
