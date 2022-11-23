import { ConsensusClient, ExecutionClient } from "../electron/IMultiClientInstaller";
import { StepKey } from "./types";

export const errors = {
  FOLDER: "Please select a folder.",
  FOLDER_DOES_NOT_EXISTS: "Folder does not exist. Select an existing folder.",
  FOLDER_IS_NOT_WRITABLE:
    "Cannot write in this folder. Select a folder in which you have write permission.",
};

export const stepLabels = {
  [StepKey.SystemCheck]: "System Check",
  [StepKey.Configuration]: "Configuration",
  [StepKey.Installing]: "Install",
};

export const nullAddress = "0x0000000000000000000000000000000000000000";

export interface IExecutionClient {
  key: ExecutionClient;
  label: string;
}

export interface IConsensusClient {
  key: ConsensusClient;
  label: string;
}

export const ConsensusClients: IConsensusClient[] = [
  {
    key: ConsensusClient.PRYSM,
    label: "Prysm",
  },
  {
    key: ConsensusClient.LIGHTHOUSE,
    label: "Lighthouse",
  },
  {
    key: ConsensusClient.NIMBUS,
    label: "Nimbus",
  },
  {
    key: ConsensusClient.TEKU,
    label: "Teku",
  },
  {
    key: ConsensusClient.LODESTAR,
    label: "Lodestar",
  },
];
export const ExecutionClients: IExecutionClient[] = [
  {
    key: ExecutionClient.GETH,
    label: "Geth",
  },
  {
    key: ExecutionClient.ERIGON,
    label: "Erigon",
  },
  {
    key: ExecutionClient.BESU,
    label: "Besu",
  },
  {
    key: ExecutionClient.NETHERMIND,
    label: "Nethermind",
  },
];
