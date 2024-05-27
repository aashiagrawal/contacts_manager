from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import os
from dotenv import load_dotenv
from bs4 import BeautifulSoup
import time
import json
import requests

# Load environment variables from .env file
load_dotenv()

# Initialize the WebDriver
service = Service(ChromeDriverManager().install())
options = webdriver.ChromeOptions()
driver = webdriver.Chrome(service=service, options=options)

# Open LinkedIn login page
driver.get('https://www.linkedin.com/login')

# Find and fill in the username and password fields
driver.find_element(By.ID, 'username').send_keys(os.getenv('LINKEDIN_EMAIL'))
driver.find_element(By.ID, 'password').send_keys(os.getenv('LINKEDIN_PASS'))
driver.find_element(By.CSS_SELECTOR, '.login__form_action_container button').click()

# Wait until the connections page is loaded
connection_url = 'https://www.linkedin.com/mynetwork/invite-connect/connections/'
driver.get(connection_url)

# Wait until the connections are loaded
WebDriverWait(driver, 30).until(
    EC.presence_of_element_located((By.CSS_SELECTOR, 'span.mn-connection-card__name'))
)

# Scroll to load all connections
previous_height = driver.execute_script("return document.body.scrollHeight")

while True:
    # Scroll down to the bottom
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    
    # Wait for new connections to load
    time.sleep(2)
    
    # Calculate new scroll height and compare with the last scroll height
    new_height = driver.execute_script("return document.body.scrollHeight")
    
    if new_height == previous_height:
        break
    
    previous_height = new_height

# Get the page source after scrolling
page_source = driver.page_source

# Parse the HTML using Beautiful Soup
soup = BeautifulSoup(page_source, 'html.parser')

# Find all connection cards
connection_cards = soup.find_all('div', {'class': 'mn-connection-card__details'})
connection_data = []

# Loop through each connection card and extract details
for card in connection_cards:
    name_element = card.find('span', {'class': 'mn-connection-card__name t-16 t-black t-bold'})
    bio_element = card.find('span', {'class': 'mn-connection-card__occupation t-14 t-black--light t-normal'})
    img_element = card.find_previous('img', {'class': 'presence-entity__image'})
    connection_date_element = card.find('time', {'class': 'time-badge t-12 t-black--light t-normal'})
    
    name = name_element.get_text(strip=True) if name_element else 'N/A'
    bio = bio_element.get_text(strip=True) if bio_element else 'N/A'
    img_url = img_element['src'] if img_element else 'N/A'
    connection_date = connection_date_element.get_text(strip=True) if connection_date_element else 'N/A'
    
    # Print the extracted data
    print('Name:', name)
    print('Bio:', bio)
    print('Image URL:', img_url)
    print('Connection Date:', connection_date)
    print('-' * 40)

    connection = {
        'name': name,
        'bio': bio,
        'img_link': img_url,
        'connection_date': connection_date
    }
    connection_data.append(connection)

# Print the total number of connections found
print(f"Total connections found: {len(connection_cards)}")

api_url = 'http://localhost:3000/api/contacts'
response = requests.post(api_url, json={'connections': connection_data})

# Close the browser
driver.quit()
