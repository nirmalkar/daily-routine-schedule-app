chmod +x run.sh
chmod +x build.sh
docker stop daily-routine-schedule-app
docker rm -f daily-routine-schedule-app
docker run --name daily-routine-schedule-app -v ~/daily-routine-schedule-app/daily_routine.db:/instance/daily_routine.db --restart unless-stopped -p 5748:5000 -p 5749:3000 daily-routine-schedule-app
