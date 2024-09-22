const scriptURL = 'GOOGLE_SHEETS_APP_SCRIPT_URL';

const form = document.getElementById('contact-form');
const submissionDateField = document.getElementById('submission-date');

form.addEventListener('submit', e => {
    e.preventDefault();

    if (validateForm()) {

        // Get current date/time
        const now = new Date();

        // Format month with full month name (e.g., January, February, etc.)
        const month = now.toLocaleString('default', { month: 'long' });

        // Format the date as "Month Day, Year - hour:minute"
        const formattedDate = `${month} ${now.getDate()}, ${now.getFullYear()} - ${formatAMPM(now)}`;

        // Function to format hour:minute with AM/PM
        function formatAMPM(date) {
            let hours = date.getHours();
            let minutes = date.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0' + minutes : minutes;
            const strTime = hours + ':' + minutes + ' ' + ampm;
            return strTime;
        }

        // Set formatted date in hidden field
        submissionDateField.value = formattedDate;

        fetch(scriptURL, { method: 'POST', body: new FormData(form)})
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // assuming your script returns JSON
        })
        .then(data => {
            alert("Thank you! Your form has been submitted successfully");
            window.location.reload();
        })
        .catch(error => {
            console.error('Error!', error.message);
            alert('Failed to submit form. Please try again later.');
        });
    } else {
        alert("Please fill out all fields before submitting.");
    }
});

function validateForm() {
    let isValid = true;
    const inputs = form.querySelectorAll('input[type=text], input[type=email], textarea');

    inputs.forEach(input => {
        if (input.value.trim() === '') {
            isValid = false;
        }
    });

    return isValid;
}
