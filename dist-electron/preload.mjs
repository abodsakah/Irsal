"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  // Expose generic ipcRenderer methods
  on: (...args) => {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(
      channel,
      (event, ...args2) => listener(event, ...args2)
    );
  },
  off: (...args) => {
    const [channel, listener] = args;
    return electron.ipcRenderer.off(channel, listener);
  },
  send: (...args) => {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke: (...args) => {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  },
  // Expose specific database and Twilio API methods by invoking IPC channels
  addMember: (member) => electron.ipcRenderer.invoke("add-member", member),
  getAllMembers: () => electron.ipcRenderer.invoke("get-all-members"),
  updateMember: (member) => electron.ipcRenderer.invoke("update-member", member),
  deleteMember: (id) => electron.ipcRenderer.invoke("delete-member", id),
  getSetting: (key) => electron.ipcRenderer.invoke("get-setting", key),
  setSetting: (key, value) => electron.ipcRenderer.invoke("set-setting", key, value),
  sendSms: (to, message) => electron.ipcRenderer.invoke("send-sms", to, message)
});
