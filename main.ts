import { ConfigurationFromCli } from "./src/configuration.ts";
import {
  QualityGateStatus,
  SonarAnalysisStatus,
  SonarApiClient,
} from "./src/sonarapiclient.ts";

function getTaskid(taskFile: string): string {
  const taskContent = Deno.readTextFileSync(taskFile);
  const lines = taskContent.split("\n");

  for (const line of lines) {
    if (line.startsWith("ceTaskId")) {
      return line.split("=")[1];
    }
  }

  throw new Error("ceTaskId not found in task file");
}

enum AnalysisStatus {
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  TIMEOUT = "TIMEOUT",
}

interface AnalysisResult {
  status: AnalysisStatus;
  analysisId?: string;
}

async function getAnalysisResult(
  sonarClient: SonarApiClient,
  taskId: string,
  timeoutInSeconds: number,
): Promise<AnalysisResult> {
  const RETRY_INTERVAL = 1000;

  const startTime = new Date().getTime();
  const timeLimit = startTime + timeoutInSeconds * 1000;
  while (new Date().getTime() < timeLimit) {
    const ceTask = await sonarClient.getCeTask(taskId);

    if (ceTask.status === SonarAnalysisStatus.SUCCESS) {
      return { status: AnalysisStatus.SUCCESS, analysisId: ceTask.analysisId };
    }

    if (
      ceTask.status === SonarAnalysisStatus.FAILED ||
      ceTask.status === SonarAnalysisStatus.CANCELLED
    ) {
      return { status: AnalysisStatus.FAILED };
    }

    console.debug(
      `Analysis not yet completed. Retrying in ${RETRY_INTERVAL}ms...`,
    );
    await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
  }

  return { status: AnalysisStatus.TIMEOUT };
}

interface QualityGateSummary {
  status: QualityGateStatus;
  conditions: {
    status: string;
    metricKey: string;
    comparator: string;
    errorThreshold: string;
    actualValue: string;
  }[];
}

async function getQualityGateStatus(
  sonarClient: SonarApiClient,
  analysisId: string,
): Promise<QualityGateSummary> {
  const qualityGate = await sonarClient.getQualityGateStatus(analysisId);
  const summary = {
    status: qualityGate.status as QualityGateStatus,
    conditions: qualityGate.conditions,
  } as QualityGateSummary;
  return summary;
}

if (import.meta.main) {
  try {
    console.debug("Preparing to read configuration from CLI");
    const configuration = new ConfigurationFromCli(Deno.args);
    const sonarClient = new SonarApiClient(
      configuration.hostUrl,
      configuration.token,
    );
    const taskId = getTaskid(configuration.taskFile);

    console.log(
      `Extracted task id from '${configuration.taskFile}'. Resulting task id = ${taskId}`,
    );
    console.log(`Waiting for analysis for task id ${taskId}...`);
    const analysisResult = await getAnalysisResult(
      sonarClient,
      taskId,
      configuration.analysisTimeout,
    );
    if (analysisResult.status !== AnalysisStatus.SUCCESS) {
      throw new Error(`Analysis failed with status ${analysisResult}`);
    }

    console.log(
      `Analysis succeeded. Fetching quality gate status for analysis id = ${analysisResult.analysisId}`,
    );
    const qualityGateStatus = await getQualityGateStatus(
      sonarClient,
      analysisResult.analysisId!,
    );
    console.log(`Quality gate status:`, qualityGateStatus);
    if (qualityGateStatus.status !== QualityGateStatus.OK) {
      throw new Error(
        `Quality gate failed. Status is ${qualityGateStatus.status}`,
      );
    }
  } catch (e) {
    console.error(e.message);
    Deno.exit(-1);
  }
}
