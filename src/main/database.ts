import path from "path";
import fs from "fs";
import { app } from "electron";
import { createRequire } from "module";
import type Database from "better-sqlite3";

const require = createRequire(import.meta.url);

let db: Database.Database | null = null;
let dbPath: string;

export function initializeDatabase() {
	try {
		const Database = require("better-sqlite3");

		dbPath = path.join(app.getPath("userData"), "mosque_sms_app.db");

		const dbDir = path.dirname(dbPath);
		if (!fs.existsSync(dbDir)) {
			fs.mkdirSync(dbDir, { recursive: true });
		}

		db = new Database(dbPath);

		if (!db) {
			throw new Error("Failed to initialize database connection");
		}

		db.pragma("journal_mode = WAL");

		db.exec(`
      CREATE TABLE IF NOT EXISTS members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        city TEXT,
        phone_number TEXT UNIQUE NOT NULL, -- Phone number must be unique
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

		db.exec(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY, -- Unique key for each setting
        value TEXT            -- The value of the setting
      );
    `);

		const existingSettings = (
			db.prepare("SELECT key FROM settings").all() as { key: string }[]
		).map((row) => row.key);

		const defaultSettings = {
			twilio_account_sid: "",
			twilio_auth_token: "",
			twilio_phone_number: "",
			twilio_sender_id: ""
		};

		for (const key in defaultSettings) {
			if (!existingSettings.includes(key)) {
				db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)").run(
					key,
					defaultSettings[key as keyof typeof defaultSettings]
				);
			}
		}
	} catch (error) {
		console.error("Error initializing database:", error);
	}
}

export function closeDatabase() {
	if (db) {
		db.close();
	}
}

interface Member {
	id?: number;
	first_name: string;
	last_name: string;
	city?: string;
	phone_number: string;
	created_at?: string;
}

/**
 * Adds a new member to the database.
 * @param member - The member object to add (first_name, last_name, city, phone_number).
 * @returns An object containing the last inserted row ID, or null if an error occurred.
 */
export function addMember(member: Member): { id: number } | null {
	if (!db) {
		return null;
	}

	try {
		const stmt = db.prepare(
			"INSERT INTO members (first_name, last_name, city, phone_number) VALUES (?, ?, ?, ?)"
		);

		const info = stmt.run(
			member.first_name,
			member.last_name,
			member.city || null,
			member.phone_number
		);

		const result = { id: info.lastInsertRowid as number };
		return result;
	} catch (error) {
		console.error("Error adding member:", error);
		return null;
	}
}

/**
 * Retrieves all members from the database.
 * @returns An array of Member objects, or an empty array if no members or an error occurred.
 */
export function getAllMembers(): Member[] {
	if (!db) {
		return [];
	}

	try {
		const stmt = db.prepare(
			"SELECT * FROM members ORDER BY first_name ASC, last_name ASC"
		);

		const results = stmt.all() as Member[];
		return results;
	} catch (error) {
		console.error("Error getting all members:", error);
		return [];
	}
}

/**
 * Updates an existing member's information in the database.
 * @param member - The member object with updated details, including its ID.
 * @returns True if the member was updated, false otherwise.
 */
export function updateMember(member: Member): boolean {
	if (!db) {
		return false;
	}
	if (member.id === undefined) {
		return false;
	}
	try {
		const stmt = db.prepare(
			"UPDATE members SET first_name = ?, last_name = ?, city = ?, phone_number = ? WHERE id = ?"
		);
		const info = stmt.run(
			member.first_name,
			member.last_name,
			member.city || null,
			member.phone_number,
			member.id
		);
		return info.changes > 0;
	} catch (error) {
		console.error("Error updating member:", error);
		return false;
	}
}

/**
 * Deletes a member from the database by their ID.
 * @param id - The ID of the member to delete.
 * @returns True if the member was deleted, false otherwise.
 */
export function deleteMember(id: number): boolean {
	if (!db) {
		return false;
	}
	try {
		const stmt = db.prepare("DELETE FROM members WHERE id = ?");
		const info = stmt.run(id);
		return info.changes > 0;
	} catch (error) {
		console.error("Error deleting member:", error);
		return false;
	}
}

/**
 * Retrieves a specific setting value from the database.
 * @param key - The key of the setting to retrieve (e.g., 'twilio_account_sid').
 * @returns The setting's value as a string, or null if the key is not found or an error occurred.
 */
export function getSetting(key: string): string | null {
	if (!db) {
		return null;
	}
	try {
		const stmt = db.prepare("SELECT value FROM settings WHERE key = ?");
		const row = stmt.get(key) as { value: string } | undefined;
		return row ? row.value : null;
	} catch (error) {
		console.error(`Error getting setting for key "${key}":`, error);
		return null;
	}
}

/**
 * Sets or updates a setting's value in the database.
 * If the key exists, its value is updated; otherwise, a new setting is inserted.
 * @param key - The key of the setting.
 * @param value - The value to set for the setting.
 * @returns True if the setting was saved/updated, false otherwise.
 */
export function setSetting(key: string, value: string): boolean {
	if (!db) {
		return false;
	}
	try {
		const stmt = db.prepare(
			"INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)"
		);
		const info = stmt.run(key, value);
		return info.changes > 0;
	} catch (error) {
		console.error(`Error setting key "${key}" with value "${value}":`, error);
		return false;
	}
}
