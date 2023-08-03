// Author: Danish Zulfiqar
// Last updated: 27/7/23

// Login Form Style

const loginForm = document.querySelector("form.login");
const loginBtn = document.querySelector("label.login");
const signupBtn = document.querySelector("label.signup");
const signupLink = document.querySelector("form .signup-link a");

signupBtn.onclick = (() => {
    loginForm.style.marginLeft = "-50%";
});

loginBtn.onclick = (() => {
    loginForm.style.marginLeft = "0%";
});

signupLink.onclick = (() => {
    signupBtn.click();
    return false;
});


// Signup Form with cache memory storage and email varification

function signup() {
    var Email = document.getElementById('Signup-email').value;
    var password = document.getElementById('Signup-password').value;
    var FirstName = document.getElementById('first-name').value;
    var LastName = document.getElementById('last-name').value;

    // Validates inputs

    if (validate_email(Email) == false || validate_password(password) == false) {
        console.log(Email + " " + password);
        alert('Invalid Fields!!');
        return;
    }

    if (validate_field(FirstName) == false || validate_field(LastName) == false) {
        console.log(FirstName + " " + LastName);
        alert('One or More Extra Fields is Outta Line!!');
        return;
    }

    firebase.auth().createUserWithEmailAndPassword(Email, password)
        .then(function (userCredential) {
            var user = userCredential.user;

            user.sendEmailVerification().then(function () {
                console.log("Verification email sent to:", Email);

                var userData = {
                    firstName: FirstName,
                    lastName: LastName,
                    email: Email,
                    lastLogin: Date.now()
                };

                localStorage.setItem("UserRegisterData", JSON.stringify(userData));

                var message = "A verification email has been sent to your email address. Please verify your email and log in to the website.";
                alert(message);

                location.reload();

            })
                .catch(function (error) {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.error("Verification email sending error:", errorCode, errorMessage);
                });
        })
        .catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.error("Signup error:", errorCode, errorMessage);
        });
}


// Login Form with cache memory access for the first time, works only if email is varified

function login() {
    var email = document.getElementById('login-email').value;
    var password = document.getElementById('login-password').value;

    // Validates inputs

    if (validate_email(email) == false || validate_password(password) == false) {
        console.log(email + " " + password);
        alert('Invalid Inputs!!');
        return;
    }

    firebase.auth().signInWithEmailAndPassword(email, password).then(function (userCredential) {
        var user = userCredential.user;

        // Email varification

        if (user.emailVerified) {
            firebase.database().ref("users/" + user.uid + "/User_Info").once("value")
                .then(function (snapshot) {

                    // Checks if user node exists or not

                    if (!snapshot.exists()) {
                        var UserData = localStorage.getItem("UserRegisterData");
                        firebase.database().ref("users/" + user.uid + "/User_Info/crest").update(JSON.parse(UserData))
                            .then(function () {
                                console.log("User data updated in Realtime Database using first login");

                                window.location.href = "./Html/user.html"
                            })
                            .catch(function (error) {
                                console.error("Error updating user data:", error);
                            });
                    }
                })
                .catch(function (error) {
                    console.error("Error checking path existence:", error);
                });
        } else {
            console.log("User's email is not verified");
        }
    })
        .catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.error("Login error:", errorCode, errorMessage);
        });
}


// Function to validate email string

function validate_email(email) {
    expression = /^[^@]+@\w+(\.\w+)+\w$/
    if (expression.test(email) == true) {
        return true
    } else {

        return false
    }
}


// Function to validate password string

function validate_password(password) {
    if (password < 6) {
        return false
    } else {
        return true
    }
}


// Function to validate fields length for name

function validate_field(field) {
    if (field == null) {
        return false
    }

    if (field.length <= 0) {
        return false
    } else {
        return true
    }
}


// Changes url state for http auth() request

window.addEventListener("load", function () {
    window.location.replace('index.html?#');
})


// Checks for auth() state if user is logged in and varified or not (redirects to user page) 

auth.onAuthStateChanged((user) => {
    if (user) {
        if (user.emailVerified) {
            firebase.database().ref("users/" + user.uid + "/User_Info/crest").once("value")
                .then(function (snapshot) {
                    if (snapshot.exists()) {

                        var date = Date.now();
                        var refer = firebase.database().ref("users/" + user.uid + "/User_Info/crest/lastLogin");

                        refer.set(date);

                        window.location.href = "./Html/user.html";

                    }
                })
                .catch(function (error) {
                    console.error("Error checking path existence:", error);
                });
        } else {
            console.log("User's email is not verified");
        }
    }
})
