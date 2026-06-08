from fastapi import APIRouter, Query
from typing import List
import json
import os
import math

router = APIRouter(prefix="/facilities", tags=["Facilities"])

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FACILITIES_PATH = os.path.join(BASE_DIR, "../data/facilities.json")

def haversine(lat1, lng1, lat2, lng2):
    R = 6371  # Earth radius in km
    d_lat = math.radians(lat2 - lat1)
    d_lng = math.radians(lng2 - lng1)
    a = math.sin(d_lat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(d_lng/2)**2
    return R * 2 * math.asin(math.sqrt(a))

@router.get("/nearby")
def get_nearby_facilities(
    lat: float = Query(..., description="User latitude"),
    lng: float = Query(..., description="User longitude"),
    limit: int = Query(5, description="Number of facilities to return")
):
    with open(FACILITIES_PATH, "r") as f:
        facilities = json.load(f)

    for facility in facilities:
        facility["distance_km"] = round(
            haversine(lat, lng, facility["lat"], facility["lng"]), 2
        )

    sorted_facilities = sorted(facilities, key=lambda x: x["distance_km"])
    return sorted_facilities[:limit]