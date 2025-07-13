import { ipcRenderer, contextBridge } from "electron";

// Define types for better type safety
export interface Member {
	id?: number;
	first_name: string;
	last_name: string;
	city?: string;
	phone_number: string;
	created_at?: string;
}

export interface MemberWithId extends Member {
	id: number;
}

// Define the custom API for type safety in the renderer.
// This interface describes the functions that will be available on `window.ipcRenderer`.
export interface IpcRendererApi {
	// Generic IPC methods exposed by the template
	on: (
		...args: Parameters<typeof ipcRenderer.on>
	) => ReturnType<typeof ipcRenderer.on>;
	off: (
		...args: Parameters<typeof ipcRenderer.off>
	) => ReturnType<typeof ipcRenderer.off>;
	send: (
		...args: Parameters<typeof ipcRenderer.send>
	) => ReturnType<typeof ipcRenderer.send>;
	invoke: <T>(channel: string, ...args: unknown[]) => Promise<T>; // Generic invoke for any channel

	// Specific database and Twilio API methods exposed for convenience and type safety
	addMember: (member: Member) => Promise<{ id: number } | null>;
	getAllMembers: () => Promise<MemberWithId[]>; // Returns an array of members
	updateMember: (member: MemberWithId) => Promise<boolean>;
	deleteMember: (id: number) => Promise<boolean>;

	getSetting: (key: string) => Promise<string | null>; // Returns a setting value
	setSetting: (key: string, value: string) => Promise<boolean>; // Sets a setting value

	sendSms: (
		to: string,
		message: string
	) => Promise<{ success: boolean; message?: string }>; // For sending SMS
}

// Expose the ipcRenderer API to the renderer process under 'window.ipcRenderer'.
// This is done securely using contextBridge.
contextBridge.exposeInMainWorld("ipcRenderer", {
	// Expose generic ipcRenderer methods
	on: (...args: Parameters<typeof ipcRenderer.on>) => {
		const [channel, listener] = args;
		// Ensure the listener is wrapped to prevent direct exposure of Electron APIs
		return ipcRenderer.on(channel, (event, ...args) =>
			listener(event, ...args)
		);
	},
	off: (...args: Parameters<typeof ipcRenderer.off>) => {
		const [channel, listener] = args;
		return ipcRenderer.off(channel, listener);
	},
	send: (...args: Parameters<typeof ipcRenderer.send>) => {
		const [channel, ...omit] = args;
		return ipcRenderer.send(channel, ...omit);
	},
	invoke: (...args: Parameters<typeof ipcRenderer.invoke>) => {
		const [channel, ...omit] = args;
		return ipcRenderer.invoke(channel, ...omit);
	},

	// Expose specific database and Twilio API methods by invoking IPC channels
	addMember: (member: Member) => ipcRenderer.invoke("add-member", member),
	getAllMembers: () => ipcRenderer.invoke("get-all-members"),
	updateMember: (member: MemberWithId) =>
		ipcRenderer.invoke("update-member", member),
	deleteMember: (id: number) => ipcRenderer.invoke("delete-member", id),

	getSetting: (key: string) => ipcRenderer.invoke("get-setting", key),
	setSetting: (key: string, value: string) =>
		ipcRenderer.invoke("set-setting", key, value),

	sendSms: (to: string, message: string) =>
		ipcRenderer.invoke("send-sms", to, message)
});
