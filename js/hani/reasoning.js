/* HANI Brain v0.6
   Reasoning Layer

   Purpose:
   Interpret the information collected during a conversation.

   This layer:
   - identifies what is known
   - identifies what is unresolved
   - detects possible conflicts
   - separates goals/problems from proposed technology
   - understands context before technology
   - determines what HANI should understand next

   This layer does NOT:
   - recommend a final solution
   - promise an outcome
   - invent missing information
*/

window.HANI_REASONING = {

  version: "0.6",

  analyze(memory) {

    if (!memory) {

      return {
        status: "NO_MEMORY",
        situation: null,
        technicalDepth: "LOW",
        known: [],
        unresolved: ["conversation_context"],
        conflicts: [],
        proposedSolutions: [],
        confirmedRequirements: [],
        questions: [],
        concerns: [],
        nextStep: "UNDERSTAND_CONTEXT"
      };

    }


    const result = {

      status: "ANALYZING",

      situation: null,

      technicalDepth: "LOW",

      known: [],

      unresolved: [],

      conflicts: [],

      proposedSolutions: [],

      confirmedRequirements: [],

      questions: [],

      concerns: [],

      nextStep: null

    };


    /* ---------------------------------
       FACTS
    --------------------------------- */

    if (memory.facts?.length) {

      memory.facts.forEach(item => {

        result.known.push({
          type: "FACT",
          text: item.text
        });

      });

    }


    /* ---------------------------------
       REQUIREMENTS
    --------------------------------- */

    if (memory.requirements?.length) {

      memory.requirements.forEach(item => {

        result.confirmedRequirements.push(
          item.text
        );

        result.known.push({
          type: "REQUIREMENT",
          text: item.text
        });

      });

    }


    /* ---------------------------------
       GOALS
    --------------------------------- */

    if (memory.goals?.length) {

      memory.goals.forEach(item => {

        result.known.push({
          type: "GOAL",
          text: item.text
        });

      });

    }


    /* ---------------------------------
       PROBLEMS
    --------------------------------- */

    if (memory.problems?.length) {

      memory.problems.forEach(item => {

        result.known.push({
          type: "PROBLEM",
          text: item.text
        });

      });

    }


    /* ---------------------------------
       CONTEXT
    --------------------------------- */

    if (memory.context?.businessType) {

      result.situation =
        `The visitor appears to operate in ${memory.context.businessType}.`;

    }

    else if (memory.context?.primary) {

      result.situation =
        `The conversation is currently related to ${memory.context.primary}.`;

    }


    /* ---------------------------------
       PROPOSED TECHNOLOGY
    ---------------------------------
       Technology mentioned by the visitor
       is treated as a proposed direction.

       It is NOT automatically treated as
       the correct solution.
    --------------------------------- */

    const technologySources = [

      ...(memory.assumptions || []),

      ...(memory.requirements || []),

      ...(memory.technologies || [])

    ];


    const technologyText = technologySources
      .map(item => item.text || "")
      .join(" ")
      .toLowerCase();


    const proposedTechnologyPatterns = [

      "android app",
      "android application",
      "mobile app",
      "mobile application",
      "website",
      "web app",
      "web application",
      "ai agent",
      "ai automation",
      "automation",
      "flutter",
      "react native",
      "firebase",
      "node.js",
      "nodejs",
      "postgresql",
      "database",
      "api"

    ];


    const detectedTechnologySignals =
      proposedTechnologyPatterns.filter(
        pattern => technologyText.includes(pattern)
      );


    if (detectedTechnologySignals.length) {

      detectedTechnologySignals.forEach(signal => {

        result.proposedSolutions.push({

          text: signal,

          status: "UNCONFIRMED"

        });

      });

    }


    /* ---------------------------------
       TECHNOLOGY DIRECTION CHANGE
    --------------------------------- */

    const assumptionText =
      (memory.assumptions || [])
        .map(item => item.text || "")
        .join(" ")
        .toLowerCase();


    if (
      assumptionText.includes("not sure") ||
      assumptionText.includes("anymore") ||
      assumptionText.includes("no longer") ||
      assumptionText.includes("changed my mind")
    ) {

      result.conflicts.push({

        type: "DIRECTION_CHANGED",

        message:
          "The visitor appears uncertain about a previously proposed direction."

      });

    }


    /* ---------------------------------
       QUESTIONS
    --------------------------------- */

    if (memory.questions?.length) {

      result.questions =
        memory.questions.map(
          item => item.text
        );

    }


    /* ---------------------------------
       CONCERNS
    --------------------------------- */

    if (memory.concerns?.length) {

      result.concerns =
        memory.concerns.map(
          item => item.text
        );

    }


    /* ---------------------------------
       TECHNICAL DEPTH
    --------------------------------- */

    const requirementCount =
      memory.requirements?.length || 0;

    const technologyCount =
      memory.technologies?.length || 0;

    const factText =
      (memory.facts || [])
        .map(item => item.text.toLowerCase())
        .join(" ");


    const requirementText =
      (memory.requirements || [])
        .map(item => item.text.toLowerCase())
        .join(" ");


    const hasArchitectureKnowledge =
      factText.includes("architecture") ||
      factText.includes("api") ||
      factText.includes("backend") ||
      factText.includes("database") ||
      requirementText.includes("architecture") ||
      requirementText.includes("backend") ||
      requirementText.includes("database");


    const hasTechnicalStack =
      technologyCount > 0 ||
      technologyText.includes("firebase") ||
      technologyText.includes("node.js") ||
      technologyText.includes("nodejs") ||
      technologyText.includes("postgresql") ||
      technologyText.includes("flutter") ||
      technologyText.includes("react native");


    let technicalSignal =
      technologyCount +
      (hasArchitectureKnowledge ? 2 : 0) +
      (hasTechnicalStack ? 2 : 0);


    /*
       A simple "I need an Android app"
       should not automatically make the
       visitor technically advanced.
    */

    if (
      technicalSignal >= 5
    ) {

      result.technicalDepth = "HIGH";

    }

    else if (
      technicalSignal >= 2
    ) {

      result.technicalDepth = "MODERATE";

    }

    else {

      result.technicalDepth = "LOW";

    }


    /* ---------------------------------
       DISCOVERY PRIORITY 1
       CONTEXT
    ---------------------------------
       HANI must understand who the visitor
       is and what world they operate in
       before recommending technology.
    --------------------------------- */

    const hasContext =
      Boolean(
        memory.context?.businessType ||
        memory.context?.primary ||
        memory.context?.personType
      );


    if (!hasContext) {

      result.unresolved.push(
        "CONTEXT"
      );

      result.nextStep =
        "UNDERSTAND_CONTEXT";

    }


    /* ---------------------------------
       DISCOVERY PRIORITY 2
       PROBLEM / GOAL
    ---------------------------------
       Once context is understood, HANI
       needs to understand what the visitor
       is actually trying to solve or achieve.
    --------------------------------- */

    else if (
      (!memory.problems || memory.problems.length === 0) &&
      (!memory.goals || memory.goals.length === 0)
    ) {

      result.unresolved.push(
        "PROBLEM_OR_GOAL"
      );

      result.nextStep =
        "UNDERSTAND_PROBLEM_OR_GOAL";

    }


    /* ---------------------------------
       DISCOVERY PRIORITY 3
       CURRENT STATE
    ---------------------------------
       Understand what already exists before
       deciding what should be built.
    --------------------------------- */

    else if (
      (!memory.existingSystems ||
        memory.existingSystems.length === 0) &&
      (!memory.facts ||
        memory.facts.length === 0)
    ) {

      result.unresolved.push(
        "CURRENT_STATE"
      );

      result.nextStep =
        "UNDERSTAND_CURRENT_STATE";

    }


    /* ---------------------------------
       DISCOVERY PRIORITY 4
       PROPOSED TECHNOLOGY
    ---------------------------------
       If the visitor has proposed technology,
       HANI should understand why it is being
       considered before accepting it as the
       solution.
    --------------------------------- */

    else if (
      result.proposedSolutions.length > 0
    ) {

      result.unresolved.push(
        "PROPOSED_TECHNOLOGY_NOT_CONFIRMED"
      );

      result.nextStep =
        "UNDERSTAND_WHY_TECHNOLOGY_IS_BEING_CONSIDERED";

    }


    /* ---------------------------------
       DISCOVERY PRIORITY 5
          /*
       DISCOVERY PRIORITY

       HANI should understand the visitor's
       world before deciding whether a proposed
       technology should be explored.

       Order:

       1. Context
       2. Problem / Goal
       3. Proposed technology
       4. Technical project details
       5. Continue discovery
    */


    /* ---------------------------------
       PRIORITY 1 — CONTEXT
    --------------------------------- */

    if (
      !memory.context?.businessType &&
      !memory.context?.primary
    ) {

      result.unresolved.push(
        "CONTEXT"
      );

      result.nextStep =
        "UNDERSTAND_CONTEXT";

    }


    /* ---------------------------------
       PRIORITY 2 — PROBLEM / GOAL
    --------------------------------- */

    else if (
      !(memory.problems?.length) &&
      !(memory.goals?.length)
    ) {

      result.unresolved.push(
        "PROBLEM_OR_GOAL"
      );

      result.nextStep =
        "UNDERSTAND_PROBLEM_OR_GOAL";

    }


    /* ---------------------------------
       PRIORITY 3 — PROPOSED TECHNOLOGY
    ---------------------------------

       Only after HANI understands the
       visitor's context and problem should
       it investigate why a particular
       technology is being considered.
    */

    else if (
      result.unresolved.includes(
        "PROPOSED_TECHNOLOGY_NOT_CONFIRMED"
      )
    ) {

      result.nextStep =
        "UNDERSTAND_WHY_TECHNOLOGY_IS_BEING_CONSIDERED";

    }


    /* ---------------------------------
       PRIORITY 4 — TECHNICAL VISITOR
    --------------------------------- */

    else if (
      result.technicalDepth === "HIGH"
    ) {

      result.nextStep =
        "UNDERSTAND_PROJECT_DETAILS";

    }


    /* ---------------------------------
       PRIORITY 5 — CONTINUE
    --------------------------------- */

    else {

      result.nextStep =
        "CONTINUE_DISCOVERY";

    }
    result.status = "READY";

    return result;

  }

};