const txtElement = document.getElementById("txt");
var city = "Thiruparangundram";

document.addEventListener('DOMContentLoaded', async function() {
    fetch(`${city}.txt`)
        .then(response => response.text())
        .then(txt => {
            // Insert the formatted content into the <p> element
            txtElement.innerHTML = formatText(txt);
            speakText(txtElement.textContent);
        })
        .catch(error => {
            console.error('Error fetching text file:', error);
        });

        

    });


function fin(){
    fetch(`${data_ip}.txt`)
        .then(response => response.text())
        .then(txt => {
            // Insert the formatted content into the <p> element
            txtElement.innerHTML = formatText(txt);

            // Speak the text immediately after it's loaded
            speakText(txtElement.textContent);
        })
        .catch(error => {
            console.error('Error fetching text file:', error);
        });
}

$.getJSON('https://api.db-ip.com/v2/free/self', function(data) {
    console.log(JSON.stringify(data, null, 2));
    data_ip = data.ipAddress;
    console.log("IP Address:", data_ip);
});

function formatText(txt) {
    // Split the text into lines
    const lines = txt.split('\n');

    // Initialize an empty formatted text
    let formattedText = '';

    // Process each line
    lines.forEach(line => {
        // Check if the line starts with "**" (indicating a bold section)
        if (line.startsWith('**')) {
            // Remove the "**" markers and wrap the line in <strong> tags for bold formatting
            formattedText += `<strong>${line.substring(2)}</strong><br>`;
        } else {
            // Otherwise, simply append the line with a line break
            formattedText += `${line}<br>`;
        }
    });

    return formattedText;
}

function speakText(text) {
    // Create a new speech synthesis utterance
    const utterance = new SpeechSynthesisUtterance(text);

    // Speak the text
    window.speechSynthesis.speak(utterance);
}
