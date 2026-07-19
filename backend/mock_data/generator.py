import random
from typing import Dict, List, Any

# Constants replacing magic numbers
CROWD_DENSITY_MIN = 10
CROWD_DENSITY_MAX = 95
TRANSIT_ARRIVAL_MIN = 1
TRANSIT_ARRIVAL_MAX = 15
TRANSIT_BLUE_PASSENGERS_MIN = 50
TRANSIT_BLUE_PASSENGERS_MAX = 400
TRANSIT_RED_PASSENGERS_MIN = 20
TRANSIT_RED_PASSENGERS_MAX = 200
DEFAULT_TEMPERATURE = 24

def generate_crowd_density() -> List[Dict[str, Any]]:
    """Simulates realistic crowd density for various stadium zones."""
    zones = ["North Gate", "South Gate", "East Concourse", "West Concourse", "Fan Zone", "VIP Lounge"]
    return [
        {
            "zone": zone,
            "density_percentage": random.randint(CROWD_DENSITY_MIN, CROWD_DENSITY_MAX),
            "trend": random.choice(["increasing", "decreasing", "stable"])
        }
        for zone in zones
    ]

def generate_transit_data() -> List[Dict[str, Any]]:
    """Simulates incoming transit waves."""
    return [
        {
            "line": "Metro Blue", 
            "arrival_in_mins": random.randint(TRANSIT_ARRIVAL_MIN, TRANSIT_ARRIVAL_MAX), 
            "estimated_passengers": random.randint(TRANSIT_BLUE_PASSENGERS_MIN, TRANSIT_BLUE_PASSENGERS_MAX)
        },
        {
            "line": "Metro Red", 
            "arrival_in_mins": random.randint(TRANSIT_ARRIVAL_MIN, TRANSIT_ARRIVAL_MAX), 
            "estimated_passengers": random.randint(TRANSIT_RED_PASSENGERS_MIN, TRANSIT_RED_PASSENGERS_MAX)
        }
    ]

def get_mock_state() -> Dict[str, Any]:
    """Generates a complete mock state including crowd, transit, and weather data."""
    return {
        "crowd_density": generate_crowd_density(),
        "transit": generate_transit_data(),
        "weather": {"condition": "Clear", "temperature": DEFAULT_TEMPERATURE}
    }
