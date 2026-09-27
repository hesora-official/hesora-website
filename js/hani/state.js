/* HANI Conversation State */

window.HANI_STATE = {
  intent: null,
  objective: null,
  existingState: null,
  requirements: [],
  constraints: [],
  budget: null,
  missingInformation: [],
  readiness: "MINIMAL",
  discoveryStep: "intent"
};


function resetHaniState() {
  window.HANI_STATE = {
    intent: null,
    objective: null,
    existingState: null,
    requirements: [],
    constraints: [],
    budget: null,
    missingInformation: [],
    readiness: "MINIMAL",
    discoveryStep: "intent"
  };
}


function updateHaniState(data = {}) {
  Object.keys(data).forEach((key) => {
    if (data[key] !== undefined && data[key] !== null) {
      window.HANI_STATE[key] = data[key];
    }
  });

  return window.HANI_STATE;
}