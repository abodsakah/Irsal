import { IpcRendererApi } from "./preload";

declare global {
	interface Window {
		// Declare that 'window.ipcRenderer' will conform to our IpcRendererApi interface.
		ipcRenderer: IpcRendererApi;
	}
}
