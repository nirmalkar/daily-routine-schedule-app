docker stop daily-routine-schedule-app
docker rm -f daily-routine-schedule-app
docker run --name daily-routine-schedule-app -v ~/daily-routine-schedule-app/instance:/instance --restart unless-stopped -p 5748:5000 daily-routine-schedule-app
