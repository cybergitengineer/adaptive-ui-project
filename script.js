function getUsageData() {
  return JSON.parse(localStorage.getItem("adaptiveUsage")) || {};
}

function saveUsageData(data) {
  localStorage.setItem("adaptiveUsage", JSON.stringify(data));
}

function trackInteraction(featureName) {
  const usageData = getUsageData();
  usageData[featureName] = (usageData[featureName] || 0) + 1;
  saveUsageData(usageData);
  updateUsagePanel();
  adaptInterface();
}

function getMostUsedFeature() {
  const usageData = getUsageData();
  const features = Object.keys(usageData);

  if (features.length === 0) {
    return null;
  }

  return features.sort((a, b) => usageData[b] - usageData[a])[0];
}

function updateUsagePanel() {
  const usageList = document.getElementById("usageList");
  const usageData = getUsageData();

  usageList.innerHTML = "";

  if (Object.keys(usageData).length === 0) {
    const li = document.createElement("li");
    li.textContent = "No interaction data yet.";
    usageList.appendChild(li);
    return;
  }

  Object.entries(usageData)
    .sort((a, b) => b[1] - a[1])
    .forEach(([feature, count]) => {
      const li = document.createElement("li");
      li.textContent = `${feature}: ${count} interaction${count > 1 ? "s" : ""}`;
      usageList.appendChild(li);
    });
}

function generateRecommendation(mostUsed) {
  const recommendations = {
    Analytics: "You frequently use Analytics. Consider exploring Reports for deeper insights.",
    Reports: "You often use Reports. Analytics may help you review trends faster.",
    Settings: "You frequently use Settings. Help may guide you through advanced customization.",
    Help: "You often use Help. Settings can be used to personalize your experience further."
  };

  return recommendations[mostUsed] || "No recommendation available.";
}

function adaptInterface() {
  const mostUsed = getMostUsedFeature();
  const statusMessage = document.getElementById("statusMessage");
  const recommendationMessage = document.getElementById("recommendationMessage");
  const dashboard = document.getElementById("dashboard");
  const cards = Array.from(document.querySelectorAll(".card"));

  cards.forEach((card) => {
    card.classList.remove("adapted", "most-used");
  });

  if (!mostUsed) {
    statusMessage.textContent =
      "Interact with the dashboard to help the system learn your preferences.";
    recommendationMessage.textContent = "No recommendation yet.";
    return;
  }

  const targetCard = cards.find(
    (card) => card.dataset.feature === mostUsed
  );

  if (targetCard) {
    targetCard.classList.add("adapted", "most-used");
    dashboard.prepend(targetCard);

    statusMessage.textContent =
      `The interface adapted by prioritizing "${mostUsed}" because it is your most frequently used feature.`;

    recommendationMessage.textContent = generateRecommendation(mostUsed);
  }
}

function resetAdaptation() {
  localStorage.removeItem("adaptiveUsage");
  updateUsagePanel();
  adaptInterface();
}

function initializeApp() {
  const featureButtons = document.querySelectorAll(".feature-btn");
  const resetBtn = document.getElementById("resetBtn");

  featureButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const card = event.target.closest(".card");
      const featureName = card.dataset.feature;
      trackInteraction(featureName);
    });
  });

  resetBtn.addEventListener("click", resetAdaptation);

  updateUsagePanel();
  adaptInterface();
}

function generateRecommendation(mostUsed) {
  const recommendations = {
    "Analytics": "You frequently use Analytics. Consider exploring Reports for deeper insights.",
    "Reports": "You often generate Reports. Try Analytics for quick data summaries.",
    "Settings": "You adjust Settings frequently. Explore Help for guidance on advanced options.",
    "Help": "You access Help often. Consider reviewing Settings to customize your experience."
  };

  return recommendations[mostUsed] || "";
}

document.addEventListener("DOMContentLoaded", initializeApp);