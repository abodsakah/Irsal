import { ipcRenderer, contextBridge } from "electron";

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

export interface IpcRendererApi {
	on: (
		...args: Parameters<typeof ipcRenderer.on>
	) => ReturnType<typeof ipcRenderer.on>;
	off: (
		...args: Parameters<typeof ipcRenderer.off>
	) => ReturnType<typeof ipcRenderer.off>;
	send: (
		...args: Parameters<typeof ipcRenderer.send>
	) => ReturnType<typeof ipcRenderer.send>;
	invoke: <T>(channel: string, ...args: unknown[]) => Promise<T>;

	addMember: (member: Member) => Promise<{ id: number } | null>;
	getAllMembers: () => Promise<MemberWithId[]>;
	updateMember: (member: MemberWithId) => Promise<boolean>;
	deleteMember: (id: number) => Promise<boolean>;

	getSetting: (key: string) => Promise<string | null>;
	setSetting: (key: string, value: string) => Promise<boolean>;

	sendSms: (
		to: string,
		message: string
	) => Promise<{ success: boolean; message?: string }>;

	translateText: (params: {
		text: string;
		sourceLanguage?: string;
		targetLanguage?: string;
		mode?: "bilingual" | "single";
	}) => Promise<{
		success: boolean;
		translatedText?: string;
		error?: string;
	}>;
}

contextBridge.exposeInMainWorld("ipcRenderer", {
	on: (...args: Parameters<typeof ipcRenderer.on>) => {
		const [channel, listener] = args;
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

	addMember: (member: Member) => ipcRenderer.invoke("add-member", member),
	getAllMembers: () => ipcRenderer.invoke("get-all-members"),
	updateMember: (member: MemberWithId) =>
		ipcRenderer.invoke("update-member", member),
	deleteMember: (id: number) => ipcRenderer.invoke("delete-member", id),

	getSetting: (key: string) => ipcRenderer.invoke("get-setting", key),
	setSetting: (key: string, value: string) =>
		ipcRenderer.invoke("set-setting", key, value),

	sendSms: (to: string, message: string) =>
		ipcRenderer.invoke("send-sms", to, message),

	translateText: (params: {
		text: string;
		sourceLanguage?: string;
		targetLanguage?: string;
		mode?: "bilingual" | "single";
	}) => ipcRenderer.invoke("translate-text", params)
});
