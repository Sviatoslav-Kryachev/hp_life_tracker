from pydantic import BaseModel

class ManualTimeCreate(BaseModel):
    activity_id: int
    minutes: int
