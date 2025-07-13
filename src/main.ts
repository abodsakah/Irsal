import { app, BrowserWindow } from "electron";
import path from "path";
import { initializeDatabase, closeDatabase } from "./main/database"; // Import database functions
import "./main/ipcHandlers"; // Import IPC handlers (this will run setupDatabaseIpcHandlers)

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
	app.quit();
}

const createWindow = () => {
	const mainWindow = new BrowserWindow({
		width: 900,
		height: 700,
		show: false, // Don't show until ready
		webPreferences: {
			preload: path.join(__dirname, "../preload.js"), // Path to your preload script
			nodeIntegration: false, // Crucial for security
			contextIsolation: true // Crucial for security
		}
	});

	// Load the index.html of the app.
	// This path depends on your Vite-Electron template's build output.
	if (process.env.VITE_DEV_SERVER_URL) {
		mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
	} else {
		mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
	}

	// Show window once it's ready to prevent white flash
	mainWindow.once("ready-to-show", () => {
		mainWindow.show();
		// Open the DevTools (uncomment for debugging)
		// mainWindow.webContents.openDevTools();
	});
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on("ready", () => {
	console.log("App is ready, initializing database...");
	initializeDatabase(); // Initialize the database here
	createWindow();
});

// Quit when all windows are closed, except on macOS.
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	// On macOS, re-create a window if the dock icon is clicked and no windows are open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

// Close database connection before the app quits to ensure data is saved properly.
app.on("before-quit", () => {
	closeDatabase();
});
