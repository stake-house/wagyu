// renderer.d.ts
/**
 * This file contains the typescript type hinting for the preload.ts API.
 */

import { OpenDialogOptions, OpenDialogReturnValue } from "electron";

import { FileOptions, FileResult } from "tmp";

import { PathLike, Stats, Dirent } from "fs";

import { ChildProcess } from "child_process";

import { EthDockerInstaller } from "./EthDockerInstaller";
import { InstallDetails, OutputLogs } from "./IMultiClientInstaller";

export interface IElectronAPI {
  shellOpenExternal: (
    url: string,
    options?: Electron.OpenExternalOptions | undefined,
  ) => Promise<void>;
  shellShowItemInFolder: (fullPath: string) => void;
  clipboardWriteText: (ext: string, type?: "selection" | "clipboard" | undefined) => void;
  ipcRendererSendClose: () => void;
  invokeShowOpenDialog: (options: OpenDialogOptions) => Promise<OpenDialogReturnValue>;
}

export interface IBashUtilsAPI {
  doesDirectoryExist: (directory: string) => Promise<boolean>;
  isDirectoryWritable: (directory: string) => Promise<boolean>;
  findFirstFile: (directory: string, startsWith: string) => Promise<string>;
}

export interface IEthDockerAPI {
  preInstall: (outputLogs?: OutputLogs) => Promise<boolean>;
  install: (details: InstallDetails, outputLogs?: OutputLogs) => Promise<boolean>;
  importKeys: (
    network: Network,
    keyStoreDirectoryPath: string,
    keyStorePassword: string,
  ) => Promise<boolean>;
  postInstall: (network: Network, outputLogs?: OutputLogs) => Promise<boolean>;
  startNodes: (network: Network) => Promise<boolean>;
  stopNodes: (network: Network) => Promise<boolean>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
    bashUtils: IBashUtilsAPI;
    ethDocker: IEthDockerAPI;
  }
}
