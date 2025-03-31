import os
import requests

class DeepSeekClient:
    def __init__(self, api_key=None):
        self.api_key = api_key or os.getenv('DEEPSEEK_API_KEY')
        self.base_url = "https://api.deepseek.com/v1"
        
    def chat(self, message):
        """Send a message to DeepSeek chat API"""
        if not self.api_key:
            raise ValueError("DeepSeek API key not configured")
            
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "deepseek-chat",
            "messages": [{
                "role": "user",
                "content": message
            }],
            "temperature": 0.7
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/chat/completions",
                headers=headers,
                json=payload
            )
            response.raise_for_status()
            return response.json()['choices'][0]['message']['content']
        except Exception as e:
            print(f"DeepSeek API error: {e}")
            return "抱歉，AI服务暂时不可用。请稍后再试。"

# Create a global instance
deepseek = DeepSeekClient()
