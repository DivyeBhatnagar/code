import logging
import sys
from app.config import settings

def setup_logger():
    """Configure application logging"""
    log_level = logging.DEBUG if settings.ENVIRONMENT == "development" else logging.INFO
    
    logging.basicConfig(
        level=log_level,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(sys.stdout)
        ]
    )
    
    # Set specific loggers
    logging.getLogger("uvicorn").setLevel(log_level)
    logging.getLogger("fastapi").setLevel(log_level)
    
    return logging.getLogger(__name__)

logger = setup_logger()
