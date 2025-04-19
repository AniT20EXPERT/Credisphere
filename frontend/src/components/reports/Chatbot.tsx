import React, { useState } from "react";

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<{ sender: string; content: string }[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSendMessage = async () => {
    if (userInput.trim()) {
      // Add user message to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", content: userInput },
      ]);
      setUserInput(""); // Clear input after sending
      setIsLoading(true); // Start loading

      try {
        // Send the user input to the backend API
        const response = await fetch("https://192.168.55.47:4000/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ chat: userInput }), // Send user message in request body
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        // Assume the response has a 'reply' property containing the bot's response
        const botReply = data.reply || "Sorry, I couldn't understand that.";
        
        // Add bot's reply to the chat
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", content: botReply },
        ]);
      } catch (error) {
        console.error("Error sending message:", error);
        // Add a fallback message in case of error
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", content: "Oops! Something went wrong." },
        ]);
      } finally {
        setIsLoading(false); // End loading
      }
    }
  };

  return (
    <div className="fixed bottom-10 right-5 bg-white shadow-lg rounded-lg w-80 p-4">
      <div className="h-64 overflow-auto mb-3">
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender === "user" ? "text-right" : "text-left"}>
            <div
              className={`inline-block p-2 mb-2 rounded-lg ${
                msg.sender === "user" ? "bg-blue-800 text-white" : "bg-gray-200 text-black"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border border-muted rounded-lg bg-primary text-muted-foreground"
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          disabled={isLoading} // Disable button while waiting for response
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
