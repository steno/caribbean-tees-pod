#!/usr/bin/env python3
import google.generativeai as genai
import sys

# Configure the API
genai.configure(api_key="AIzaSyB26U-oMdT69P3lkheuT6ck8L9xjGqHi-8")

def chat_with_gemini(prompt):
    try:
        # Use the latest model
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        print(response.text)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        prompt = " ".join(sys.argv[1:])
        chat_with_gemini(prompt)
    else:
        print("Usage: python gemini_test.py 'your prompt here'") 