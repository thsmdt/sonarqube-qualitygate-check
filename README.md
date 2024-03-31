# SonarQube Quality Gate Check

This project provides a Deno-based script to check wait for a finished analysis
task and check the quality gate of a SonarQube analysis afterwards. If the
quality gate fails, it will return a `255` status code. This can be used to fail
a pipeline.

## Usage
The _recommended_ way to use this project is with the published docker image on [GitHub](https://github.com/thsmdt/sonarqube-qualitygate-check/pkgs/container/sonarqube-qualitygate-check).

### Docker-based
You can find the docker image hosted on GitHub.

#### GitLab CI
The recommended way to integrate this project in your GitLab CI pipeline is using the [ready-to-use component](https://gitlab.com/explore/catalog/thsmdt/sonarqube-qualitygate-check). This requires GitLab 16.2 or later.

#### Other CI systems
At the moment, there are no other integration examples available for other CI enviornments.
For GitHub Actions, consider using SonarQube's [official solution](https://github.com/SonarSource/sonarqube-quality-gate-action).