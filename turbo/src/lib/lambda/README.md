# Python Lambda

This directory holds the [AWS lambda function](https://us-west-1.console.aws.amazon.com/lambda/home?region=us-west-1#/functions/tttc-turbo-python?tab=code) used by the `python_v0` node.

## Building

If you'd like to update or deploy your own python lambda, you simply need to run the `build` script.

```bash
$ ./build
```

The Docker image uses the `amazonlinux` image, ensuring all dependencies, including binary ones run properly on AWS lambda.

## Anatomy

The lambda uses a FastAPI post, and the [mangum](https://mangum.io/) library.

## Deploying a new lambda

If you're deploying a new lambda for yourself, then make sure you create the Lambda for the python 3.7 runtime environment. Then click on 'upload from' and select zip.

## Testing

You can use the following to test the lambda:

```json
{
  "body": "eyJjb2RlIjogInByaW50KCdoZWxsbyB3b3JsZCcpIn0=",
  "resource": "/{proxy+}",
  "path": "/",
  "httpMethod": "POST",
  "isBase64Encoded": true,
  ...
```

This actually encodes `print('hello world')` in the post body code.

## Security

The lambda uses a simple secret mechanism. In the root `.env` it is the `VITE_PYTHON_LAMBDA_SECRET` variable. You can generate a new secret with:

```bash
./build --secret <secret>
```

Make sure you also add it as a `SECRET` environment variable in your lambda.
