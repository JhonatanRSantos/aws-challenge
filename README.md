# AWS Challenge

To run this project you will need:

    1 - AWS account
    2 - Node 10.x

Configuration:

    1 - Clone or download this repo.
    2 - Install all dependencies using npm install.
    3 - Install serverless with npm `install serverless -g`.
    4 - Generete your AWS credentias with IAM. Add admin permissions.
    5 - Add your credentials locally with:
        serverless config creentials --provider aws --key=YOUR_API_KEY --secret YOUR_SECRET
    6 - Deploys the project with the command:
        serverless deploy -v
    7 - Create a Standard SQS queue.
        Add a lambda trigger for this function: select the option `aws-challenge-dev-saveLog`.
    8 - Creates a DynamoDB table with pk timestamps (String) and origin (String).
    9 - Add your configurations into confi/config.json:
        - QueueUrl
        - TableName
    10 - Change iamRoleStatements resource into serverless.yml to your DynamoDB ARN.