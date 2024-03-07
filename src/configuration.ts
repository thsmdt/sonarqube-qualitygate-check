import { parse } from "https://deno.land/std@0.114.0/flags/mod.ts";

export interface Configuration {
  token: string;
  hostUrl: URL;
  taskFile: string;
  analysisTimeout: number;
}

export class ConfigurationFromCli implements Configuration {
  token: string;
  hostUrl: URL;
  taskFile: string;
  analysisTimeout: number;

  constructor(args: string[]) {
    const flags = parse(args);

    if (flags.token === undefined) throw new Error("Missing token argument");
    if (flags.hostUrl === undefined) {
      throw new Error("Missing hostUrl argument");
    }
    if (flags.taskFile === undefined) {
      throw new Error("Missing taskFile argument");
    }
    if (flags.analysisTimeout === undefined) {
      throw new Error("Missing analysisTimeout argument");
    }

    this.token = flags.token;
    this.hostUrl = new URL(flags.hostUrl);
    this.taskFile = flags.taskFile;
    this.analysisTimeout = parseInt(flags.analysisTimeout);
  }
}
