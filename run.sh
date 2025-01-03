chmod +x run.sh
chmod +x build.sh
docker stop daily-routine-schedule-app
docker rm -f daily-routine-schedule-app
docker run --name daily-routine-schedule-app -v $(pwd)/.env:/app/.env -v $(pwd)/instance:/app/instance -v $(pwd)/src/settings.json:/app/settings.json --restart unless-stopped -p 5748:5000 -p 5749:3000 daily-routine-schedule-app
