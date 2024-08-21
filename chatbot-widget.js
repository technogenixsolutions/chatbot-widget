
function createChatWidget(config) {
  // Extract configuration details
  let chatbotId = config.chatbotId;
  let accessKey = config.accessKey;
  let hostUrl = config.hostUrl;
  let appearance = config.appearance;
  let qna = config.qna;

  // Load CSS
  var link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://technogenixsolutions.github.io/chatbot-widget/chatbot-widget.css"; // Replace with your CSS CDN URL
  document.head.appendChild(link);

  // Create HTML structure
  var chatbotContainer = document.createElement("div");
  chatbotContainer.id = "chatbot-container";
  chatbotContainer.innerHTML = `
        <div id="chatbot-button"></div>
        <div id="chatbot-window">
            <div style="background" id="chatbot-header">
             <img id="rounded-img" src="${appearance.botImg}" width="50px" height="50px" alt="ChatBot"/>
                <span>${appearance?.name}!</span>
                <button id="close-chatbot">×</button>
            </div>
            <div id="chatbot-messages"></div>
            <input id="chatbot-input" type="text" placeholder="Type a message...">
        </div>
        <div id="initial-prompt">
          <div id="prompt-header">
            <span>Welcome!</span>
            <button id="close-prompt" aria-label="Close prompt">×</button>
          </div>
          <p>Please enter your name:</p>
          <input id="customer-name" type="text" placeholder="Your name">
          <p>Please enter your email:</p>
          <input id="customer-email" type="email" placeholder="Your email">
          <button id="start-chat">Start Chat</button>
        </div>
    `;
  document.body.appendChild(chatbotContainer);
  // var chatbotHeader = document.getElementById("chatbot-header");
  // chatbotHeader.style.backgroundColor = appearance.primaryColor;

  var chatbotHeader = document.getElementById("chatbot-header");
  chatbotHeader.style.background = `linear-gradient(135deg, ${appearance.primaryColor}, ${appearance.secondaryColor})`;
 
 
  var chatbotButton = document.getElementById("chatbot-button");
  chatbotButton.style.background = `${appearance.primaryColor}`
  var chatbotWindow = document.getElementById("chatbot-window");
  var closeButton = document.getElementById("close-chatbot");
 
  var initialPrompt = document.getElementById("initial-prompt");
  var startChatButton = document.getElementById("start-chat");
  startChatButton.style.background = `${appearance.primaryColor}`
  var customerNameInput = document.getElementById("customer-name");
  var customerEmailInput = document.getElementById("customer-email");
  var closePromptButton = document.getElementById("close-prompt");
  closePromptButton.style.background = `${appearance.primaryColor}`
  if (
    !chatbotButton ||
    !chatbotWindow ||
    !closeButton ||
    !initialPrompt ||
    !startChatButton ||
    !customerNameInput ||
    !customerEmailInput ||
    !closePromptButton
  ) {
    console.error("Chatbot elements are missing in the HTML.");
    return;
  }

  var customerName = "";
  var customerEmail = "";

  // Hide initial prompt and chat window initially
  initialPrompt.style.display = "none";
  chatbotWindow.style.display = "none";

  chatbotButton.addEventListener("click", function () {
    initialPrompt.style.display = "block"; // Show initial prompt
    chatbotButton.style.display = "none"; // Hide the chat button
  });

  startChatButton.addEventListener("click", function () {
    customerName = customerNameInput.value.trim();
    customerEmail = customerEmailInput.value.trim();
    if (customerName && customerEmail) {
      initialPrompt.style.display = "none"; // Hide name and email prompt
      chatbotWindow.style.display = "flex"; // Show chat window
      messagesDiv.innerHTML += `<p><strong>${appearance?.name}:</strong> Hello ${customerName}, how can I help you today?</p>`;
    } else {
      alert("Please enter both your name and email.");
    }
  });

  closeButton.addEventListener("click", function () {
    chatbotWindow.style.display = "none"; // Hide chat window
    chatbotButton.style.display = "block"; // Show the chat button
  });

  closePromptButton.addEventListener("click", function () {
    initialPrompt.style.display = "none"; // Hide initial prompt
    chatbotButton.style.display = "block"; // Show the chat button
  });

  var messagesDiv = document.getElementById("chatbot-messages");
  var inputField = document.getElementById("chatbot-input");

  inputField.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      var userMessage = inputField.value;
      messagesDiv.innerHTML += `<p><strong>${customerName || "You"}:</strong> ${userMessage}</p>`;
      inputField.value = "";

      // Send message to backend API
      fetch(`${hostUrl}/chatbot`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accessKey}` },
        body: JSON.stringify({ message: userMessage, chatbotId: chatbotId }),
      })
        .then((response) => response.json())
        .then((data) => {
          messagesDiv.innerHTML += `<p><strong>${appearance?.name}:</strong> ${data.reply}</p>`;
          messagesDiv.scrollTop = messagesDiv.scrollHeight;
        })
        .catch((error) => {
          console.error("Error:", error);
          messagesDiv.innerHTML += `<p><strong>${appearance?.name}:</strong> Sorry, there was an error processing your message.</p>`;
        });
    }
  });
}
