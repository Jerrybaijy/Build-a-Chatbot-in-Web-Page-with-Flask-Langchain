import os
from dotenv import load_dotenv
from flask import Flask, render_template, request, jsonify
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, AIMessage, BaseMessage
from typing import List

# ----------------- 应用初始化 ---------------------
app = Flask(__name__)
# 加载环境变量
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    print("警告: GEMINI_API_KEY 环境变量未设置。请在 .env 文件中设置它。")

# 实例化模型
model = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    api_key=GEMINI_API_KEY
)

# ----------------- 对话历史管理（简化版）-------------------------
# ⚠️ 提示：在多用户生产环境中，应使用 Flask Session 或 LangChain Memory 
# 为每个用户维护独立的历史记录。
chat_history: List[BaseMessage] = []
system_instruction = "你是一个友好且乐于助人的 AI 助手。请记住用户的上下文和之前的对话。所有回复都用中文。"

# ----------------- 路由和 API ---------------------

@app.route('/')
def index():
    """
    渲染博客主页（blog.html），其中包含嵌入的 AI 聊天组件。
    """
    return render_template('blog.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    """
    处理用户的聊天请求，与 Gemini 模型交互。
    """
    global chat_history
    
    data = request.get_json()
    user_input = data.get('message')

    if not user_input:
        return jsonify({"error": "No message provided"}), 400

    try:
        current_human_message = HumanMessage(content=user_input)
        full_messages = chat_history + [current_human_message]

        ai_response_message = model.invoke(full_messages)
        ai_response_text = ai_response_message.content

        chat_history.append(current_human_message)
        chat_history.append(ai_response_message)

        return jsonify({"response": ai_response_text})

    except Exception as e:
        print(f"❌ 发生了一个错误: {e}")
        return jsonify({"error": f"An error occurred: {e}"}), 500

if __name__ == '__main__':
    app.run(debug=True)