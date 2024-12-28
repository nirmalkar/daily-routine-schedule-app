docker stop daily-routine-schedule-app
docker rm -f daily-routine-schedule-app
docker run --name ai-daily-routine-schedule-app --restart unless-stopped -p 5748:5000 daily-routine-schedule-app
