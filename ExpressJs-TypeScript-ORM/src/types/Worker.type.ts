export interface ExtendedWorker extends Worker {
    process: {
      pid: number;
      env: NodeJS.ProcessEnv; // Explicitly type the env property
    };
  }