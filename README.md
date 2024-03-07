# SonarQube Quality Gate Check

This project provides a Deno-based script to check wait for a finished analysis
task and check the quality gate of a SonarQube analysis afterwards. If the
quality gate fails, it will return a `255` status code. This can be used to fail
a pipeline.

## Usage
The _recommended_ way to use this project is with the published docker image on [DockerHub](https://google.de).

### Docker-based
You can find the docker image hosted on DockerHub.

#### GitLab CI
The following job definition is a great stating point for the integration in your own pipeline.
Make sure you have access to a GitLab Runner whose executor is `docker`.

```bash
ADD JOB DEFINITION HERE
```

#### Other CI systems
At the moment, there are no other integration examples available for other CI enviornments.
For GitHub Actions, consider using SonarQube's [official solution](https://github.com/SonarSource/sonarqube-quality-gate-action).