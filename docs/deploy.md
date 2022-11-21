# Project CI/CD

## Architecture

Project is built using node.js, then deployed to S3, and hosted with CloudFront.

There are 3 deployment environments:
- development/testing
- staging
- production

Every environment build/deployment is triggered by git pushes into Gitlab to its respective branch. Development is built from `dev` branch, staging is built from `stage` branch & production is built from `master` branch. Git tags are not utilized in the process.

Drone.io is used for the pipelines & all configuration is configured in `.drone.yml`.

## Variables

All variables that end up on the deployed application are in the `.drone.yml` file, in `environment` section:

```yaml
- name: Build Development
  image: kudato/baseimage:node12
  commands:
  - npm install --quiet
  - npm run build
  environment:
    GOOGLE_MAPS_KEY: 'your-google-api-key'
  when:
    branch: dev
    event:
    - push
    - pull_request
```

## AWS

The current configuration is enabled for S3/CloudFront deployment. You need to configure these services:
- CI IAM user for accessing resources
- S3 buckets
- CloudFront distributions

## Deployment

After AWS is set up and the project is enabled on Drone.io, CD process should start working automatically with the next git push event.
