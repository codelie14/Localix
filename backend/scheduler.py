from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from datetime import datetime
import asyncio
import os
import sys

# Add backend directory to path
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_dir)

from services import scraper_service, ollama_service


async def scheduled_vulnerability_scrape():
    """Scheduled job to scrape vulnerability sources"""
    print(f"[{datetime.now()}] Running scheduled vulnerability scrape...")
    try:
        results = await scraper_service.run_all_scrapers()
        print(f"[{datetime.now()}] Scraped {len(results)} sources")
        
        # TODO: Process and store results in database
        
    except Exception as e:
        print(f"[{datetime.now()}] Error in scheduled scrape: {e}")


async def scheduled_threat_intel_scrape():
    """Scheduled job to scrape threat intelligence sources"""
    print(f"[{datetime.now()}] Running scheduled threat intel scrape...")
    try:
        # Scrape threat intel blogs
        blog_sources = [
            "https://thehackernews.com/",
            "https://www.bleepingcomputer.com/"
        ]
        
        for url in blog_sources:
            result = await scraper_service.scrape_source(url)
            print(f"[{datetime.now()}] Scraped {result.get('count', 0)} articles from {url}")
            
            # TODO: Analyze articles with AI and store in database
            
    except Exception as e:
        print(f"[{datetime.now()}] Error in threat intel scrape: {e}")


async def cleanup_old_data():
    """Scheduled job to clean up old data"""
    print(f"[{datetime.now()}] Running data cleanup...")
    try:
        # TODO: Implement cleanup logic
        print(f"[{datetime.now()}] Cleanup completed")
    except Exception as e:
        print(f"[{datetime.now()}] Error in cleanup: {e}")


async def start_schedulers():
    """Initialize and start all schedulers"""
    scheduler = AsyncIOScheduler()
    
    # Schedule vulnerability scrape every 6 hours
    scheduler.add_job(
        scheduled_vulnerability_scrape,
        CronTrigger(hour=0, minute=0),  # Midnight
        id='vuln_scrape',
        name='Vulnerability Scraping',
        replace_existing=True
    )
    
    # Schedule threat intel scrape every 3 hours
    scheduler.add_job(
        scheduled_threat_intel_scrape,
        CronTrigger(minute=0),  # Every hour
        id='threat_scrape',
        name='Threat Intel Scraping',
        replace_existing=True
    )
    
    # Schedule cleanup daily
    scheduler.add_job(
        cleanup_old_data,
        CronTrigger(hour=2, minute=0),  # 2 AM
        id='cleanup',
        name='Data Cleanup',
        replace_existing=True
    )
    
    scheduler.start()
    print(f"[{datetime.now()}] All schedulers started")
    
    return scheduler
