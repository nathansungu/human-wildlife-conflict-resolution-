import cv2
from ultralytics import YOLO


class AnimalTracker:
    def __init__(
        self,
        model_path: str,
        stream_url: str,
        conf_threshold: float = 0.4,
        min_frames: int = 3,
        max_missed_frames: int = 10,
    ):
        self.model = YOLO(model_path)
        self.stream_url = stream_url

        self.conf_threshold = conf_threshold
        self.min_frames = min_frames
        self.max_missed_frames = max_missed_frames

        self.video_capture = None
        self.animal_tracking = {}
        self.reported_animals = set()
        self.latest_detections = []


   
    def _get_video_capture(self):
        if self.video_capture is None or not self.video_capture.isOpened():
            self.video_capture = cv2.VideoCapture(self.stream_url)

            if not self.video_capture.isOpened():
                print("Cannot open video stream")
                return None

            print("Connected to video stream")

        return self.video_capture

    def release(self):
        if self.video_capture:
            self.video_capture.release()
            self.video_capture = None
            print("Video capture released")

   
    def process_frame(self):
        cap = self._get_video_capture()
        if cap is None:
            return None

        ret, frame = cap.read()
        if not ret:
            return None

        current_frame_ids = set()
        results = self.model.track(frame, persist=True)

        for result in results:
            boxes = result.boxes
            if boxes is None:
                continue

            for box in boxes:
                conf = float(box.conf[0])
                cls_id = int(box.cls[0])

                if conf < self.conf_threshold or box.id is None:
                    continue

                track_id = int(box.id[0])
                current_frame_ids.add(track_id)

                x1, y1, x2, y2 = map(int, box.xyxy[0])
                h, w, _ = frame.shape
                x1, y1 = max(0, x1), max(0, y1)
                x2, y2 = min(w, x2), min(h, y2)

                cropped_img = frame[y1:y2, x1:x2]
                if cropped_img.size == 0:
                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 2)
                    continue

                class_name = self.model.names.get(cls_id, str(cls_id))

                if track_id not in self.animal_tracking:
                    self.animal_tracking[track_id] = {
                        "confidence": conf,
                        "class_id": cls_id,
                        "class_name": class_name,
                        "frame_count": 1,
                        "last_seen": 0,
                        "bbox": (x1, y1, x2, y2),
                        "number": 1
                        
                    }
                    
                else:
                    data = self.animal_tracking[track_id]
                    data["frame_count"] += 1

                    if conf > data["confidence"]:
                        data["confidence"] = conf
                        data["bbox"] = (x1, y1, x2, y2)

     
        for track_id in list(self.animal_tracking.keys()):            
            data = self.animal_tracking[track_id]

            if (data["frame_count"] == self.min_frames and track_id not in self.reported_animals):

                self.reported_animals.add(track_id)               
                result = {
                    "track_id": track_id,                    
                    "class_id": data["class_id"],
                    "class_name": data["class_name"],
                    "confidence": round(data["confidence"], 3),
                    "frames_detected": data["frame_count"],
                    "bbox": data["bbox"],
                }

                self.latest_detections.append(result)
                del self.animal_tracking[track_id]
                
                return result


        return None

   
    def reset(self):
        self.animal_tracking = {}
        self.reported_animals = set()
        print("Tracking reset")

    def restart(self):
        self.release()
        self._get_video_capture()
