import threading
import time
import requests
from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.predict import AnimalTracker
import os
from dotenv import load_dotenv
load_dotenv()

trackers = {}

MODEL_PATH = "./models/best.pt"
# NODE_URL = "http://localhost:3000/api/cameras"
# get url from env variable if set, otherwise use default
NODE_URL = os.getenv("NODE_URL")

RETRY_ATTEMPTS = 5
RETRY_DELAY = 3  


def load_cameras():
    for attempt in range(1, RETRY_ATTEMPTS + 1):
        try:
            print(f"Loading cameras... (attempt {attempt}/{RETRY_ATTEMPTS})")
            response = requests.get(NODE_URL, timeout=5)
            response.raise_for_status()

            if not response.text.strip():
                print("WARNING: Empty response from Node server.")
                return False

            cameras = response.json()
            print(f"Loaded cameras: {cameras}")

            if not cameras:
                print("No cameras returned from server.")
                return True  

            for cam in cameras:
                camera_id = cam["id"]
                stream_url = cam["streamUrl"]
                if camera_id not in trackers:
                    trackers[camera_id] = AnimalTracker(
                        model_path=MODEL_PATH,
                        stream_url=stream_url
                    )
            print(f"Successfully loaded {len(trackers)} tracker(s).")
            return True

        except requests.exceptions.ConnectionError:
            print(f"Attempt {attempt}: Could not connect to Node server at {NODE_URL}")
        except requests.exceptions.Timeout:
            print(f"Attempt {attempt}: Request timed out.")
        except Exception as e:
            print(f"Attempt {attempt}: Unexpected error: {e}")

        if attempt < RETRY_ATTEMPTS:
            print(f"Retrying in {RETRY_DELAY}s...")
            time.sleep(RETRY_DELAY)

    print(f"WARNING: Could not load cameras after {RETRY_ATTEMPTS} attempts. Continuing without cameras.")
    return False


def detection_loop():
    cameras_loaded = bool(trackers)

    while True:
        if not cameras_loaded:
            print("No trackers active. Retrying camera load...")
            cameras_loaded = load_cameras()
            if not cameras_loaded:
                time.sleep(10)
                continue

        for tracker in list(trackers.values()):
            tracker.process_frame()
        time.sleep(0.5)


@asynccontextmanager
async def lifespan(app: FastAPI):
    load_cameras() 
    thread = threading.Thread(target=detection_loop, daemon=True)
    thread.start()
    yield


app = FastAPI(lifespan=lifespan)


@app.get("/detect-animals")
async def detect_animals():
    results = {}
    for camera_id, tracker in trackers.items():
        results[camera_id] = tracker.latest_detections.copy()
        tracker.latest_detections.clear()
    return {"results": results}


@app.post("/reset")
async def reset_tracking():
    for tracker in trackers.values():
        tracker.reset()
        tracker.latest_detections.clear()
    return {"status": "reset complete"}


@app.post("/restart")
async def restart_tracking():
    for tracker in trackers.values():
        tracker.restart()
        tracker.latest_detections.clear()
    return {"status": "restart complete"}