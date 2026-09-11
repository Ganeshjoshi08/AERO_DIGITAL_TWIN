import csv
import os
from typing import Dict, Any, Optional

class TelemetryReplayService:
    """
    Service responsible for sequential, lazy-loading playback of the
    synthetic UAV engine run-to-failure dataset CSV file.
    """

    def __init__(self, filepath: str):
        self.filepath = filepath
        self._total_frames = 0
        self._current_index = 0
        self._file = None
        self._reader = None
        self._finished = False
        self.last_row: Optional[Dict[str, str]] = None
        
        # Verify file presence and count records (excluding header)
        if not os.path.exists(self.filepath):
            raise FileNotFoundError(f"Telemetry CSV dataset not found at {self.filepath}")
            
        with open(self.filepath, "r", encoding="utf-8") as f:
            self._total_frames = sum(1 for _ in f) - 1
            
        self.reset()

    def reset(self) -> None:
        """
        Closes any active file stream, re-opens the CSV, and resets position pointer to 0.
        """
        if self._file:
            try:
                self._file.close()
            except Exception:
                pass
                
        self._file = open(self.filepath, "r", encoding="utf-8", newline="")
        self._reader = csv.DictReader(self._file)
        self._current_index = 0
        self._finished = False
        self.last_row = None

    def next_frame(self) -> Optional[Dict[str, str]]:
        """
        Retrieves the next telemetry record from the CSV stream.
        Returns None if EOF is reached.
        """
        if self._finished or self._reader is None:
            return None
            
        try:
            row = next(self._reader)
            self._current_index += 1
            self.last_row = row
            return row
        except StopIteration:
            self._finished = True
            return None

    def current_position(self) -> int:
        """
        Returns the 1-based index of the last read frame, or 0 if reset.
        """
        return self._current_index

    def total_frames(self) -> int:
        """
        Returns the total number of telemetry records in the dataset.
        """
        return self._total_frames

    def is_finished(self) -> bool:
        """
        Returns True if the reader has reached the end of the CSV dataset.
        """
        return self._finished

    def __del__(self) -> None:
        if self._file:
            try:
                self._file.close()
            except Exception:
                pass
