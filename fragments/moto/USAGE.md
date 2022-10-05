## Requirements
- Docker 20.x.x~
- Node.js 16.x.x~

## moto server setup
```shell
# first time
docker run -d -p 5000:5000 --name <your-container-name> motoserver/moto:latest cognito-idp 

## from the next
docker container start <your-container-name>
```

### re-run
デフォルトの挙動ではインメモリで構成管理してるっぽいので、containerを落とすたびにSDK叩いてCallした内容は消える。

```shell
docker container restart <your-container-name>
```

永続化については利用目的に対しメリットがないので、方法はあるかもしれないが調べていない。



