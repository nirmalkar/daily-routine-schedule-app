chmod +x run.sh
chmod +x build.sh
docker build -t daily-routine-schedule-app --progress=plain . 2>&1 | tee build.log
