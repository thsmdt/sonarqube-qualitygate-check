#!/bin/sh
exec deno run --allow-net --allow-read main.ts --hostUrl="$SONAR_HOST_URL" --taskFile="$SONAR_TASK_FILE" --analysisTimeout="$SONAR_ANALYSIS_TIMEOUT_SECONDS" --token="$SONAR_TOKEN" "$@"
