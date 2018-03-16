dnbkr_bot

trading bot
reddit metrics


[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]
BUILD

docker build -t dnbkr_bot .

docker tag dnbkr_bot legshampoo/dnbkr_bot

(docker push legshampoo/repository:tag)
docker push legshampoo/dnbkr_bot

--------------

RUN

test:
docker run --restart=always -p 80:3000 legshampoo/dnbkr_bot

Production:
docker run -p 80:3000 —name firstrun -d legshampoo/dnbkr_bot


original docker start script
CMD npm run start:forever
