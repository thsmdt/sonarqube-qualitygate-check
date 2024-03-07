export enum SonarAnalysisStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
  IN_PROGRESS = "IN_PROGRESS",
}

export interface TaskResult {
  id: string;
  type: string;
  componentId: string;
  componentKey: string;
  componentName: string;
  componentQualifier: string;
  analysisId: string;
  status: SonarAnalysisStatus;
  submittedAt: string;
  submitterLogin: string;
  startedAt: string;
  executedAt: string;
  executionTimeMs: number;
  hasScannerContext: boolean;
  warningCount: number;
  warnings: string[];
}

interface SonarCeTaskResult {
  task: TaskResult;
}

export enum QualityGateStatus {
  OK = "OK",
  WARN = "WARN",
  ERROR = "ERROR",
  NONE = "NONE",
}

interface SonarQualityGateProjectStatus {
  projectStatus: SonarProjectStatus;
}
interface SonarProjectStatus {
  status: QualityGateStatus;
  ignoredConditions: boolean;
  caycStatus: string;
  conditions: {
    status: string;
    metricKey: string;
    comparator: string;
    errorThreshold: string;
    actualValue: string;
  }[];
  period: {
    id: number;
    mode: string;
    date: string;
    parameter: string;
  };
}

export class SonarApiClient {
  private baseUrl: URL;
  private token: string;

  constructor(baseUrl: URL, token: string) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  async getCeTask(
    taskId: string,
    additionalFields?: string,
  ): Promise<TaskResult> {
    const url = `${this.baseUrl}api/ce/task?id=${taskId}${
      additionalFields ? `&additionalFields=${additionalFields}` : ""
    }`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      const ceTaskResult = await response.json() as SonarCeTaskResult;
      return ceTaskResult.task;
    } catch (error) {
      throw new Error(`Failed to fetch CE task: ${error.message}`);
    }
  }

  async getQualityGateStatus(analysisId?: string): Promise<SonarProjectStatus> {
    const url =
      `${this.baseUrl}api/qualitygates/project_status?analysisId=${analysisId}`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      const qgProjectStatus = await response
        .json() as SonarQualityGateProjectStatus;
      return qgProjectStatus.projectStatus;
    } catch (error) {
      throw new Error(`Failed to fetch project status: ${error.message}`);
    }
  }
}
