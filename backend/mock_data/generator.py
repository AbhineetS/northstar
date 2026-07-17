import random
from typing import Dict, List

def generate_crowd_density() -> List[Dict]:
    """Simulates realistic crowd density for various stadium zones."""
    zones = ["North Gate", "South Gate", "East Concourse", "West Concourse", "Fan Zone", "VIP Lounge"]
    return [
        {
            "zone": zone,
            "density_percentage": random.randint(10, 95),
            "trend": random.choice(["increasing", "decreasing", "stable"])
        }
        for zone in zones
    ]

def generate_transit_data() -> List[Dict]:
    """Simulates incoming transit waves."""
    return [
        {"line": "Metro Blue", "arrival_in_mins": random.randint(1, 15), "estimated_passengers": random.randint(50, 400)},
        {"line": "Metro Red", "arrival_in_mins": random.randint(1, 15), "estimated_passengers": random.randint(20, 200)}
    ]

def get_mock_state() -> Dict:
    return {
        "crowd_density": generate_crowd_density(),
        "transit": generate_transit_data(),
        "weather": {"condition": "Clear", "temperature": 24}
    }
