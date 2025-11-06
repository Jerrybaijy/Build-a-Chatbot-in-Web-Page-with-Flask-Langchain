# Build a Chatbot in Web Page with Flask & Langchain

![image-20251106224646037](assets/image-20251106224646037.png)

- **概述**：这是一个从 0 到 1 的 AI Agent 开发及部署项目。
- **来源**：自己搭建
- **功能**：在一个博客网页中加入一个聊天模型
- **技术栈**：Flask，Langchain
- **存储**
  - 代码存储在 Git 托管平台：前后端合并存储 `Build-a-Chatbot-in-Web-Page-with-Flask-Langchain`
  - Image 存储在 DockerHub：`jerrybaijy/flask-langchain:v1.0`

## 项目文件结构

```
your-flask-chat/
├── app.py
├── .env
├── requirements.txt
├── templates/
│   └── blog.html
│   └── chat_widget.html
└── static/
    ├── style.css
    └── script.js
```

## 项目依赖

在您的项目根目录下创建 **`requirements.txt`** 文件。

```
Flask
python-dotenv
langchain-google-genai
langchain-core
```

```bash
pip install -r requirements.txt
```

## 运行项目

```bash
docker run -d \
  --name my-flask-chat \
  -p 5000:5000 \
  jerrybaijy/flask-langchain:v1.0
```

