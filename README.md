# AWS Challenge

To run this project you will need:

    1 - AWS Account
    2 - Node 10.x
    3 - Serverless

Configuration:

1 - Create an AWS account: https://aws.amazon.com/ <br>
2 - Install Serverles and AWS CLI. https://serverless.com/ <br>
3 - Config you AWS credentials. https://serverless.com/framework/docs/providers/aws/cli-reference/config-credentials/ <br>
4 - Clone or download the repo. <br>
5 - Go to your ~/path/where/you/save/aws-challenge/ and run: <br>
```sh
$ yarn # If you use it or;
$ npm install # If you use it.
```
6 - And then to deploy the application:
```sh
$ STAGE=dev sls deploy
```

Testing:

POST:   https://some_URL_amazonaws.com/dev/create_log_entry <br>
Body:
```JSON
{
	"origin": "front-end",
	"type": "log",
	"message": "message sent from frontend"
}
```
Response:
```JSON
{
    "status": true
}
```
GET:    https://some_URL_amazonaws.com/dev/get_logs_by_origin?origin=front-end <br>
Response:
```JSON
{
    "status": true,
    "body": [
        {
            "origin": "front-end",
            "message": "message sent from frontend",
            "timestamps": "1582430285559",
            "type": "log"
        },
        {
            "origin": "front-end",
            "message": "message sent from frontend",
            "timestamps": "1582430344241",
            "type": "log"
        }
    ]
}
```
GET:    https://some_URL_amazonaws.com/dev/get_logs_by_type?type=log <br>
Response:
```JSON
{
    "status": true,
    "body": [
        {
            "origin": "front-end",
            "message": "message sent from frontend",
            "timestamps": "1582430285559",
            "type": "log"
        },
        {
            "origin": "front-end",
            "message": "message sent from frontend",
            "timestamps": "1582430344241",
            "type": "log"
        }
    ]
}
```