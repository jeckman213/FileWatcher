import time
import datetime
import random

messages = [
    "Something new happened",
    "Something even newer happened",
    "Error with flashing BMC",
    "Error with flashing CPLD",
    "Warning some file is missing",
    "IDK why this happened but it did",
    "Reading TPM and updating",
    "Running run.ps1 -updates",
    "Running fru update"
]

random.seed(time.time())

time.sleep(5)

for i in range(100):
    with open("file.log", 'a') as file:
        right_now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        file.write(f"{right_now} - {messages[random.randrange(0, len(messages) - 1)]}\n")
    time.sleep(random.randrange(1, 2))