from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class Location(BaseModel):
    lat: float
    lng: float

class Zone(BaseModel):
    id: str
    name: str
    capacity: int
    current_occupancy: int
    status: str = Field(..., description="optimal, warning, critical")
    
class Incident(BaseModel):
    id: str
    zone_id: str
    type: str
    severity: int
    description: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class Weather(BaseModel):
    condition: str
    temperature_c: float

class ContextFrame(BaseModel):
    """The snapshot of reality sent to the AI Engine"""
    role: str
    location: Optional[str] = None
    crowd_density: Optional[int] = 0
    active_incidents: Optional[int] = 0
    weather: Optional[Weather] = None
    time: datetime = Field(default_factory=datetime.utcnow)

class AIDecision(BaseModel):
    action: str
    target: str
    reason: str
    ui_component: str
