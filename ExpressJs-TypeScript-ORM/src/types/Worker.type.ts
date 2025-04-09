import { Worker } from "cluster";
import { ChildProcess } from "child_process";

export interface ExtendedWorker extends Worker {
  process: ChildProcess & {
    env: NodeJS.ProcessEnv; // Explicitly type the env property
  };
}