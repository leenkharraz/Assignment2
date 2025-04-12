// API Source: Ergast Developer API for F1 data
// URL: https://ergast.com/mrd/

function showMessage(type, text) {
  const messageBox = document.getElementById("messageBox");
  messageBox.className = type === "error" ? "message-error" : "message-success";
  messageBox.textContent = text;
  messageBox.style.display = "block";
}

document.getElementById("driverForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const year = document.getElementById("yearInput").value.trim();
  const results = document.getElementById("results");

  results.innerHTML = "";
  document.getElementById("messageBox").style.display = "block";

  if (year === "") {
    showMessage("error", "Kindly add a year.");
    return;
  }

  if (isNaN(year) || year < 1950 || year > new Date().getFullYear()) {
    showMessage("error", "Please enter a valid year between 1950 and now.");
    return;
  }

  showMessage("success", "Loading driver data...");

  fetch(`https://ergast.com/api/f1/${year}/drivers.json`)
    .then((res) => res.json())
    .then((data) => {
      const drivers = data.MRData.DriverTable.Drivers;

      if (!drivers || drivers.length === 0) {
        showMessage("error", "No drivers found for this season.");
        return;
      }

      showMessage("success", `Found ${drivers.length} drivers in ${year}:`);

      drivers.forEach((driver) => {
        const card = document.createElement("div");
        card.className = "driver-card";

        card.innerHTML = `
          <strong>Name:</strong> ${driver.givenName} ${driver.familyName}<br/>
          <strong>Nationality:</strong> ${driver.nationality}<br/>
          <strong>Date of Birth:</strong> ${driver.dateOfBirth}<br/>
          <strong>Number:</strong> ${driver.permanentNumber || 'N/A'}<br/>
          <strong>More Info:</strong> <a href="${driver.url}" target="_blank">Wikipedia</a>
        `;

        results.appendChild(card);
      });
    })
    .catch(() => {
      showMessage("error", "Failed to fetch driver data.");
    });
});

document.getElementById("resetBtn").addEventListener("click", () => {
  document.getElementById("yearInput").value = "";
  document.getElementById("messageBox").className = "";
  document.getElementById("messageBox").style.display = "none";
  document.getElementById("results").innerHTML = "";
});
