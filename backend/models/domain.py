from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class Location(BaseModel):
    """Represents geographic coordinates."""
    lat: float
    lng: float

class Zone(BaseModel):
    """Represents a stadium zone."""
    id: str
    name: str
    capacity: int
    current_occupancy: int
    status: str = Field(..., description="optimal, warning, critical")
    
class Incident(BaseModel):
    """Represents an active incident."""
    id: str
    zone_id: str
    type: str
    severity: int
    description: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class Weather(BaseModel):
    """Represents current weather conditions."""
    condition: str
    temperature_c: float

class SustainabilityMetrics(BaseModel):
    """Represents real-time sustainability data."""
    power_consumption_mw: float
    water_usage_lpm: int
    waste_diversion_percent: int

class StaffTask(BaseModel):
    """Represents an assigned task to staff or volunteers."""
    id: str
    assignee_role: str
    description: str
    status: str = Field(..., description="pending, in_progress, completed")


class ContextFrame(BaseModel):
    """The snapshot of reality sent to the AI Engine."""
    role: str
    location: Optional[str] = None
    crowd_density: Optional[int] = 0
    active_incidents: Optional[int] = 0
    weather: Optional[Weather] = None
    sustainability: Optional[SustainabilityMetrics] = None
    active_tasks: Optional[int] = 0
    time: datetime = Field(default_factory=datetime.utcnow)

class AIDecision(BaseModel):
    """Represents a decision made by the AI engine."""
    action: str
    target: str
    reason: str
    ui_component: str
