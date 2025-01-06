from flask import Flask, request, jsonify
from PIL import Image
import google.generativeai as genai
import json
from flask_cors import CORS
from dotenv import load_dotenv
import os
import logging
import datetime

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure the Gemini API with key from environment
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
genai.configure(api_key=GOOGLE_API_KEY)

def setup_logging():
    logs_dir = Path(__file__).parent / 'logs'
    logs_dir.mkdir(exist_ok=True)
    
    log_file = logs_dir / f'gemini_responses_{datetime.now().strftime("%Y%m%d")}.log'
    logging.basicConfig(
        filename=str(log_file),
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s'
    )

@app.route('/api/analyze', methods=['POST'])
def analyze_car():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided', 'errorType': 'NO_IMAGE'}), 400
        
    file = request.files['image']
    
    if not file.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
        return jsonify({'error': 'Invalid image format', 'errorType': 'INVALID_FORMAT'}), 400
    
    try:
        image = Image.open(file)
        
        # Initialize Gemini Pro Vision model
        generation_config = {
            "temperature": 1,
            "top_p": 0.95,
            "top_k": 64,
            "max_output_tokens": 8192,
        }
        model = genai.GenerativeModel('gemini-1.5-flash', generation_config=generation_config)
        
        prompt = """Analyze this car image and provide:
        Car make
        Car make + model
        Year Range of manufacture
        Price range in USD
        Horse power
        Top speed in km/h
        Rarity level (Common, Uncommon ,, Very Rare, Ultra Rare) based on the number of cars of that model still in existence and its price.
        Chances (Common = (1/10), Uncommon = (1/100), Rare = (1/1000), Very Rare = (1/100000), Ultra Rare = (1/1000000))
        
        Provide just the information that is asked, nothing else or any additional information. 
        Not bold Titles as short as possible for each category, max 2 words
        Dont put any introductory text.
        Always provide all the information requested, if you dont have the information for a category, make an educated guess, never leave a category blank.
        Just provide information if the image provides a car or a motorcycle. Dont provide any information about anything other than that, jsut print error.
        Provide the OUTPUT in JSON with the following format, 
        plain text without the ```json at the begining and the end to send it to another script it has to be in a perfect Json format. 
        Example:
        "Car Make": "Porsche",
        "Model": "Porsche 356",
        "Year": [1950, 1965],
        "Price": {
            "min": 100000,
            "max": 500000,
            "unit": "USD"
        },
        "HP": [60, 130],
        "Speed": {
            "max": [160, 200],
            "unit": "km/h"
        },
        "Chances": {
            "Rarity": "Very Rare",
            "Chance": "1/100000"
        }
        """

        response = model.generate_content([prompt, image])
        
        # Check if response contains error indicating not a car
        if "error" in response.text.lower():
            return jsonify({'error': 'The image does not appear to be a car', 'errorType': 'NOT_CAR'}), 400
            
        result = json.loads(response.text)
        return jsonify(result)
        
    except json.JSONDecodeError:
        return jsonify({'error': 'Invalid response format', 'errorType': 'INVALID_RESPONSE'}), 500
    except Exception as e:
        return jsonify({'error': str(e), 'errorType': 'ANALYSIS_FAILED'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5000)