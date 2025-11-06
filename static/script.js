const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const chatIcon = document.getElementById("chat-icon"); // 聊天图标
const chatMainContainer = document.getElementById("chat-box-main"); // 对话框主体

// 切换聊天窗口显示/隐藏
function toggleChat() {
  // 切换 hidden 类
  const isHidden = chatMainContainer.classList.toggle("hidden");

  // 切换图标的显示状态：如果对话框隐藏，则显示图标
  chatIcon.style.display = isHidden ? "block" : "none";

  // 如果显示了，则自动聚焦输入框
  if (!isHidden) {
    userInput.focus();
  }
}

// 处理键盘按键事件 (Enter 发送)
function handleKeyPress(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
}

// 创建消息元素的函数
function createMessageElement(text, isUser) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message");
  messageDiv.classList.add(isUser ? "user-message" : "ai-message");
  messageDiv.textContent = text;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight; // 滚动到底部
}

// 创建加载消息
function createLoadingMessage() {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", "ai-message");
  messageDiv.innerHTML = "思考中...";
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
  return messageDiv;
}

// 发送消息的主函数
async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  // 1. 禁用输入和按钮
  sendBtn.disabled = true;
  userInput.disabled = true;
  userInput.value = "";

  // 2. 显示用户消息
  createMessageElement(message, true);

  // 3. 显示加载提示
  const loadingMessage = createLoadingMessage();

  try {
    // 4. 调用后端 API
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: message }),
    });

    // 5. 处理响应
    const data = await response.json();

    // 移除加载提示
    chatBox.removeChild(loadingMessage);

    if (response.ok) {
      createMessageElement(data.response, false);
    } else {
      createMessageElement(`[错误]: ${data.error || "服务器错误"}`, false);
    }
  } catch (error) {
    // 移除加载提示
    chatBox.removeChild(loadingMessage);
    createMessageElement(
      `[网络错误]: 无法连接到服务器 (${error.message})`,
      false
    );
  } finally {
    // 6. 重新启用输入和按钮并聚焦
    sendBtn.disabled = false;
    userInput.disabled = false;

    // 只有当对话框可见时才聚焦
    if (!chatMainContainer.classList.contains("hidden")) {
      userInput.focus();
    }
  }
}
