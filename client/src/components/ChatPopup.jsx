import React, { Component } from "react";
import { sendMessage as sendMessageAPI } from "../api/chat";

class ChatPopup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      message: "",
      chat: [
        { role: "bot", text: "Hey 👋 I'm your AI assistant. Ask me anything!" }
      ],
      loading: false,
    };

    this.chatEndRef = React.createRef();
  }

  toggleChat = () => {
    this.setState((prev) => ({ open: !prev.open }));
  };

  handleChange = (e) => {
    this.setState({ message: e.target.value });
  };

  scrollToBottom = () => {
    this.chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  handleSend = async () => {
    const { message, chat } = this.state;
    if (!message.trim()) return;

    const newChat = [...chat, { role: "user", text: message }];

    this.setState({
      chat: newChat,
      message: "",
      loading: true,
    });

    try {
      const reply = await sendMessageAPI(message);

      this.setState(
        {
          chat: [...newChat, { role: "bot", text: reply }],
          loading: false,
        },
        this.scrollToBottom
      );
    } catch (err) {
      this.setState({
        chat: [...newChat, { role: "bot", text: "Something went wrong ❌" }],
        loading: false,
      });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.chat !== this.state.chat) {
      this.scrollToBottom();
    }
  }

  render() {
    const { open, message, chat, loading } = this.state;

    return (
      <>
        {/* Floating Button */}
        <button
          onClick={this.toggleChat}
          className="fixed bottom-5 right-5 
          bg-gradient-to-r from-indigo-600 to-purple-600 
          text-white p-4 rounded-full shadow-xl 
          hover:scale-110 transition-all duration-300"
        >
          💬
        </button>

        {/* Chat Popup */}
        {open && (
          <div className="fixed bottom-24 right-5 w-[360px] h-[520px] 
          bg-[#0f172a]/95 backdrop-blur-xl 
          border border-white/10 
          rounded-2xl shadow-2xl 
          flex flex-col overflow-hidden">

            {/* Header */}
            <div className="p-3 flex justify-between items-center 
            bg-gradient-to-r from-indigo-600 to-purple-600 
            text-white font-semibold text-sm">
              🤖 AI Assistant
              <button onClick={this.toggleChat}>✖</button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-3 overflow-y-auto space-y-3 text-sm text-gray-200">

              {chat.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-2xl max-w-[75%] shadow-md ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                        : "bg-[#1e293b] text-gray-200 border border-white/10"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {loading && (
                <div className="flex gap-1 px-2">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
                </div>
              )}

              <div ref={this.chatEndRef}></div>
            </div>

            {/* Input */}
            <div className="p-2 flex gap-2 bg-[#0f172a] border-t border-white/10">
              <input
                className="flex-1 p-2 rounded-lg bg-[#1e293b] text-white placeholder-gray-400 outline-none"
                value={message}
                onChange={this.handleChange}
                placeholder="Ask anything..."
                onKeyDown={(e) =>
                  e.key === "Enter" && this.handleSend()
                }
              />
              <button
                onClick={this.handleSend}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 rounded-lg hover:opacity-90"
              >
                ➤
              </button>
            </div>
          </div>
        )}
      </>
    );
  }
}

export default ChatPopup;