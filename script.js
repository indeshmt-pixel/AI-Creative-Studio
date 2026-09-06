const form = document.querySelector(".contact-form");

emailjs.init({
    publicKey: "dvWGdJxqjArqC_B4k"
});

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    if (!name || !email || !message) {
        alert("Please fill all fields.");
        return;
    }

    const templateParams = {
        name: name,
        email: email,
        message: message,
        title: "New Portfolio Contact Message"
    };

    emailjs.send(
        "service_xp3mcep",
        "template_1mkbpit",
        templateParams
    )
    .then(function () {
        alert("Thank you, " + name + "! Your message has been sent successfully.");
        form.reset();
    })
    .catch(function (error) {
        console.error("EmailJS Error:", error);
        alert("Sorry, your message could not be sent. Please try again.");
    });
});