/* HANI Intent Detection */

function detectHaniIntent(text) {
  const message = text.toLowerCase();

  if (
    message.includes("android") ||
    message.includes("mobile app") ||
    message.includes("application")
  ) {
    return "ANDROID_DEVELOPMENT";
  }

  if (
    message.includes("website") ||
    message.includes("web site") ||
    message.includes("web app")
  ) {
    return "WEBSITE_DEVELOPMENT";
  }

  if (
    message.includes("automate") ||
    message.includes("automation") ||
    message.includes("workflow")
  ) {
    return "AUTOMATION";
  }

  if (
    message.includes("ai agent") ||
    message.includes("ai automation") ||
    message.includes("artificial intelligence")
  ) {
    return "AI_AGENTS";
  }

  if (
    message.includes("play store") ||
    message.includes("google play") ||
    message.includes("developer account")
  ) {
    return "GOOGLE_PLAY";
  }

  if (
    message.includes("not sure") ||
    message.includes("don't know") ||
    message.includes("dont know") ||
    message.includes("unsure")
  ) {
    return "UNSURE";
  }

  return "GENERAL_INQUIRY";
}


function getHaniIntentResponse(intent) {
  const responses = {
    ANDROID_DEVELOPMENT:
      "I can help you plan an Android solution. What should the app actually do?",

    WEBSITE_DEVELOPMENT:
      "I can help with the website. What are you trying to achieve with it?",

    AUTOMATION:
      "I can help identify the simplest practical automation. What process are you currently doing manually?",

    AI_AGENTS:
      "I can help determine whether an AI agent is actually useful here. What would you want the agent to do?",

    GOOGLE_PLAY:
      "I can help understand the Google Play situation. What happened to the app or developer account?",

    UNSURE:
      "That's fine. Start with the problem you're trying to solve, and I'll help work out the practical solution.",

    GENERAL_INQUIRY:
      "I can help you figure that out. Tell me what you're trying to build, improve, publish or solve."
  };

  return responses[intent] || responses.GENERAL_INQUIRY;
}