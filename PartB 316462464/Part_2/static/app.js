const users = [
    { id: 1, username: 'admin', password: '1234', displayName: "Admin" },
    { id: 2, username: 'nadav', password: '1234', displayName: "Nadav" }
];


function signIn() {
    const usernameElement = document.getElementById('username');
    const passwordElement = document.getElementById('password');

    if (usernameElement.value && passwordElement.value) {
        const user = users.find((u) => u.username === usernameElement.value && u.password === passwordElement.value);
        if (user) {
            sessionStorage.setItem("LOGGED_IN_USER", JSON.stringify(user));
            window.location = "HomePage.html";
        } else {
            alert("Wrong credentials!");
        }
    }
    else {
        alert('Username & password are required!');
    }
}

function initialize_min_date() {
    var current_date = new Date().toISOString().split("T")[0];
    document.getElementById("Bdate").min = current_date;
}

function check_inputs(msg) {
    var check_fullName = check_str_onlyLetters(document.getElementById("full_name"));
    if(check_fullName) {
        alert(msg);
        return true;
    } 
    else {
        document.getElementById("full_name_error").innerHTML = "Only English letters";
        return false;
    }
}

function check_str_onlyLetters(name) {
    return /^[A-Za-z]+$/i.test(name);
}


/******************************GEO LOCATION************************** */

const findMyLocation = () => {
    const status= document.querySelector('.status');

    const success = (position) => {
        console.log(position)
    }

    const error = () => {
        place.textContent = 'Unable to retrieve your location';
    }

    navigator.geolocation.getCurrentPosition(seccess, error);
}

const findStateElem = document.querySelector(".find-state");
if (findStateElem) {
    findStateElem.addEventListener("click", findMyLocation);
}

// Check if user loggedIn
const loggedInUserListItemElem = document.getElementById("logged-in-user-item");
if (loggedInUserListItemElem && sessionStorage.getItem('LOGGED_IN_USER')) {
    const user = JSON.parse(sessionStorage.getItem('LOGGED_IN_USER'));
    loggedInUserListItemElem.innerHTML = `
        <span>Hey, ${user.displayName}</span> 
        <button class="button" id="signup" onclick="logout()">Logout</button>
    `;
}

function logout() {
    sessionStorage.removeItem("LOGGED_IN_USER");
    window.location = "Sign-In-page.html";
}