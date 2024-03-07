FROM denoland/deno:alpine-1.41.1 AS builder

WORKDIR /app
COPY . .

RUN deno cache main.ts

# ---
FROM denoland/deno:alpine-1.41.1

WORKDIR /app

COPY --from=builder /deno-dir/ /deno-dir/
COPY --from=builder /app/ .

USER deno

ENV SONAR_HOST_URL=https://sonarcloud.io
ENV SONAR_TASK_FILE=.sonarqube/out/.sonar/report-task.txt
ENV SONAR_ANALYSIS_TIMEOUT_SECONDS=300

COPY entrypoint.sh .
ENTRYPOINT ["./entrypoint.sh"]