Reference: https://zenn.dev/27ma4_ton10/articles/113f8b8bac07c7c9a49f

## in SAM local
Copy `env.sample.json` to `env.json` and override parameters before do it.

```shell
sam local invoke ${function_name} --env-vars env.json
```
## deploy
```shell
sam deploy --parameter-overrides StageName=${your_api_stage_name} HttpApiUserPoolArn=${your_user_pool_arn} HttpApiUserPoolId=${your_user_pool_id} StageName=${your_stage_name(Optional)}
```
