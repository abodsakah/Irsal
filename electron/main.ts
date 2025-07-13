import { app, BrowserWindow } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { initializeDatabase, closeDatabase } from "../src/main/database";
import { setupDatabaseIpcHandlers } from "../src/main/ipcHandlers";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "..");

export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
	? path.join(process.env.APP_ROOT, "public")
	: RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
	win = new BrowserWindow({
		icon: path.join(process.env.VITE_PUBLIC || "", "electron-vite.svg"),
		webPreferences: {
			preload: path.join(__dirname, "preload.mjs")
		}
	});

	win.webContents.on("did-finish-load", () => {
		win?.webContents.send("main-process-message", new Date().toLocaleString());
	});

	if (VITE_DEV_SERVER_URL) {
		win.loadURL(VITE_DEV_SERVER_URL);

		win.webContents.openDevTools();
	} else {
		win.loadFile(path.join(RENDERER_DIST, "index.html"));
	}
}

app.on("window-all-closed", () => {
	try {
		closeDatabase();
	} catch (error) {
		console.error("Error closing database:", error);
	}

	if (process.platform !== "darwin") {
		app.quit();
		win = null;
	}
});

app.on("before-quit", () => {
	try {
		closeDatabase();
	} catch (error) {
		console.error("Error closing database on quit:", error);
	}
});

app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

app.whenReady().then(() => {
	try {
		initializeDatabase();

		setupDatabaseIpcHandlers();
	} catch (error) {
		console.error("Error during app initialization:", error);
	}

	createWindow();
});
