import { IpcRendererApi } from "./preload";

declare global {
	interface Window {
		ipcRenderer: IpcRendererApi;
	}
}
