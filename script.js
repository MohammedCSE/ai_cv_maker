const fileInput = document.getElementById("cv-upload");
const uploadCard = document.querySelector(".upload-card");
const uploadButton = document.querySelector(".upload-button");


// When user selects a PDF
fileInput.addEventListener("change", async function () {

    const file = fileInput.files[0];

    if (!file) {
        return;
    }

    // Check file type
    if (file.type !== "application/pdf") {
        alert("Please upload a PDF file.");
        return;
    }

    // Check file size
    if (file.size > 10 * 1024 * 1024) {
        alert("PDF must be smaller than 10MB.");
        return;
    }

    // Show loading state
    uploadButton.textContent = "Analysing CV...";
    uploadButton.style.pointerEvents = "none";

    try {

        // Create form data
        const formData = new FormData();

        formData.append("file", file);


        // Send PDF to FastAPI
        const response = await fetch(
            "http://127.0.0.1:8000/analyze",
            {
                method: "POST",
                body: formData
            }
        );


        // Convert response into JSON
        const data = await response.json();


        // Check for backend error
        if (data.error) {
            throw new Error(data.error);
        }


        console.log("AI analysis:", data);
sessionStorage.setItem(
    "cvAnalysis",
    JSON.stringify(data)
);

window.location.href = "results.html";

    } catch (error) {

        console.error(error);

        alert(
            "Something went wrong:\n" +
            error.message
        );

    } finally {

        // Reset button
        uploadButton.textContent = "Choose PDF";
        uploadButton.style.pointerEvents = "auto";

    }

});
function displayResults(data) {

    console.log("Overall score:", data.overall_score);

    console.log("Section scores:", data.sections);

    console.log("Improvements:", data.improvements);


    // For now just show the results
    alert(
        `CV Score: ${data.overall_score}/100\n\n` +

        `Profile: ${data.sections.profile}\n` +
        `Skills: ${data.sections.skills}\n` +
        `Experience: ${data.sections.experience}\n` +
        `Projects: ${data.sections.projects}\n` +
        `Education: ${data.sections.education}\n` +
        `Formatting: ${data.sections.formatting}\n\n` +

        `Improvements:\n` +
        `• ${data.improvements[0]}\n` +
        `• ${data.improvements[1]}\n` +
        `• ${data.improvements[2]}`
    );
}