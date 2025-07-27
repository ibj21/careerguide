import sys
import os
import json
import joblib

import warnings
warnings.filterwarnings("ignore", category=UserWarning)


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model_path = os.path.join(BASE_DIR, 'career_path_model.pkl')
label_encoder_path = os.path.join(BASE_DIR, 'label_encoder.pkl')

# Load model and label encoder
model = joblib.load(model_path)
le = joblib.load(label_encoder_path)

# Read JSON input from stdin
input_str = sys.stdin.read()
try:
    input_data = json.loads(input_str)
except json.JSONDecodeError:
    print("Error: Invalid JSON input")
    sys.exit(1)

# Validate input length
if not isinstance(input_data, list) or len(input_data) != 18:
    print("Error: Input must be a list of 18 encoded answers (0-4).")
    sys.exit(1)

# Optional: validate each answer is in 0-4
if any((not isinstance(x, int) or x < 0 or x > 4) for x in input_data):
    print("Error: Each answer must be an integer between 0 and 4.")
    sys.exit(1)

# Make prediction (input_data is wrapped in a list to form 2D array for sklearn)
prediction = model.predict([input_data])[0]

# Convert numeric prediction back to label
career = le.inverse_transform([prediction])[0]

# Print ONLY the career string (no extra text!)
print(career)
