const storedData = sessionStorage.getItem("cvAnalysis");

if (!storedData) {
    alert("No CV analysis found.");
    window.location.href = "index.html";
    throw new Error("No CV analysis found.");
}

const data = JSON.parse(storedData);

console.log("Original CV:", data.original_text);


// Get section scores

const sections = data.sections;


// Display overall score

const overallScore = data.overall_score;

document.getElementById("overallScore").textContent = overallScore;


// Display score message

const scoreMessage = document.getElementById("scoreMessage");

if (overallScore >= 85) {

    scoreMessage.textContent = "Excellent CV";

} else if (overallScore >= 70) {

    scoreMessage.textContent = "Strong CV";

} else if (overallScore >= 55) {

    scoreMessage.textContent = "Good foundation";

} else {

    scoreMessage.textContent = "Needs improvement";

}


// Score circle

const scoreCircle = document.querySelector(".score-circle");

const degrees = overallScore * 3.6;

setTimeout(() => {

    scoreCircle.style.background = `
        conic-gradient(
            #8b7cff 0deg,
            #3db9ff ${degrees}deg,
            rgba(255,255,255,0.06) ${degrees}deg
        )
    `;

}, 200);


// Section scores

setSection("profile", sections.profile);
setSection("skills", sections.skills);
setSection("experience", sections.experience);
setSection("projects", sections.projects);
setSection("education", sections.education);
setSection("formatting", sections.formatting);


// Function to update section score + progress bar

function setSection(name, score) {

    document.getElementById(
        name + "Score"
    ).textContent = score;

    setTimeout(() => {

        document.getElementById(
            name + "Bar"
        ).style.width = score + "%";

    }, 300);

}


// Update graph

setChart("Profile", sections.profile);
setChart("Skills", sections.skills);
setChart("Experience", sections.experience);
setChart("Projects", sections.projects);
setChart("Education", sections.education);
setChart("Formatting", sections.formatting);


// Function for graph bars

function setChart(name, score) {

    document.getElementById(
        "chart" + name
    ).style.width = score + "%";

    document.getElementById(
        "chart" + name + "Value"
    ).textContent = score;

}


// AI improvements

if (data.improvements && data.improvements.length >= 3) {

    document.getElementById(
        "improvement1"
    ).textContent = data.improvements[0];

    document.getElementById(
        "improvement2"
    ).textContent = data.improvements[1];

    document.getElementById(
        "improvement3"
    ).textContent = data.improvements[2];

}


// Analyse another CV

function newAnalysis() {

    sessionStorage.removeItem("cvAnalysis");

    window.location.href = "index.html";

}