import threading
import time
import requests
from fastapi import FastAPI
from app.predict import AnimalTracker  

app = FastAPI()

trackers = {}

MODEL_PATH = "./models/best.pt"
NODE_URL = "http://localhost:3000/api/camera"

def load_cameras():
    response = requests.get(NODE_URL)
    cameras = response.json()

    if not cameras:
        return

    for cam in cameras:
        camera_id = cam["id"]
        stream_url = cam["streamUrl"]
                
        if camera_id not in trackers:
            trackers[camera_id] = AnimalTracker(
                model_path=MODEL_PATH,
                stream_url=stream_url
            )

def detection_loop():
    while True:
        for tracker in trackers.values():
            tracker.process_frame()
        time.sleep(0.5)  

@app.on_event("startup")
def startup_event():
    load_cameras()
    thread = threading.Thread(target=detection_loop, daemon=True)
    thread.start()


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