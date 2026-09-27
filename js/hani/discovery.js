/* HANI Discovery Engine */

function getHaniDiscoveryQuestion() {
  const state = window.HANI_STATE;

  if (!state || !state.intent) {
    return "What are you trying to build, improve, publish or solve?";
  }

  if (!state.objective) {
    const objectiveQuestions = {
      ANDROID_DEVELOPMENT:
        "What should the Android app actually help people do?",

      WEBSITE_DEVELOPMENT:
        "What should the website help you achieve?",

      AUTOMATION:
        "What process are you currently doing manually?",

      AI_AGENTS:
        "What would you want the AI agent to do for you?",

      GOOGLE_PLAY:
        "What happened with your app or Google Play developer account?",

      UNSURE:
        "What problem are you trying to solve?"
    };

    return (
      objectiveQuestions[state.intent] ||
      "What are you trying to achieve?"
    );
  }

  if (!state.existingState) {
    return "Do you already have something in place, or would this be a new solution?";
  }

  if (state.requirements.length === 0) {
    return "What are the most important things the solution should do?";
  }

  if (state.constraints.length === 0) {
    return "Are there any important constraints, such as budget, timeline or technical requirements?";
  }

  return "Thanks. I have enough information to start shaping the practical solution.";
}


function processHaniDiscoveryAnswer(text) {
  const state = window.HANI_STATE;

  if (!state || !state.intent) {
    return;
  }

  if (!state.objective) {
    updateHaniState({
      objective: text,
      discoveryStep: "objective"
    });

    return;
  }

  if (!state.existingState) {
    updateHaniState({
      existingState: text,
      discoveryStep: "existingState"
    });

    return;
  }

  if (state.requirements.length === 0) {
    updateHaniState({
      requirements: [text],
      discoveryStep: "requirements"
    });

    return;
  }

  if (state.constraints.length === 0) {
    updateHaniState({
      constraints: [text],
      discoveryStep: "constraints"
    });

    return;
  }

  updateHaniState({
    readiness: "SUFFICIENT"
  });
}