const BASE_SERVER_API_URL = `http://localhost:3000/api`;

function createNavbar() {
    let navHTML = `
        <header>
        <nav class="navbar">
            <div class="navbar__container">
                <a href="index.html" id="navbar__logo">  <img src="../static/Images/OrgLOGO.svg" alt="LOGO"
                    width="100px" height="100px">Doggy Mister</a>
               
                    <div class="navbar__toggle" id="mobile-menu">
                    <span class="bar"></span>
                    <span class="bar"></span>
                    <span class="bar"></span>
                </div>

                <ul class="navbar__menu">
                    <li class="navbar__item">
                        <a href="index.html" class="navbar__links" id="home-page">Home</a>
                    </li>
                    <li class="navbar__item">
                        <a href="about.html" class="navbar__links" id="about-page">About</a>
                    </li>
                    `;
                    if (sessionStorage.getItem("LOGGED_IN_USER")) {
                        const user = JSON.parse(sessionStorage.getItem("LOGGED_IN_USER"));
                        if (user.user_type === "Consumer") {
                            navHTML += `
                                <li class="navbar__item">
                                    <a href="search.html" class="navbar__links" id="search-page">Search</a>
                                </li>
                            `;
                        }
                    }
                    navHTML += `
                    <li class="navbar__btn" id="logged-in-user-item">
                        <a href="sign-in.html" class="button" id="signup">Sign In</a>
                    </li>
                </ul>
            </div>
        </nav>
    </header>
    `;

    document.body.innerHTML = navHTML + document.body.innerHTML;
}
createNavbar();

function signIn(event) {
    event.preventDefault();
    const usernameElement = document.getElementById("email");
    const passwordElement = document.getElementById("password");

    if (usernameElement.value && passwordElement.value) {
        fetch(`${BASE_SERVER_API_URL}/auth`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: usernameElement.value,
                password: passwordElement.value,
            }),
        })
            .then((response) => response.json())
            .then((response) => {
                if (response.data?.length > 0) {
                    const user = response.data[0];
                    sessionStorage.setItem(
                        "LOGGED_IN_USER",
                        JSON.stringify(user)
                    );
                    window.location = "index.html";
                } else {
                    alert("No user was found for the given email & password!");
                }
            })
            .catch((e) => {
                console.log(e);
                alert("A server error occurred");
            });
    } else {
        alert("Email & password are required!");
    }
}

function signUp(event) {
    event.preventDefault();
    let costElement;
    let experienceElement;

    const fullnameElement = document.getElementById("full_name");
    const emailElement = document.getElementById("user_email");
    const passElement = document.getElementById("pass");
    const bdateElement = document.getElementById("Bdate");
    const commentsElement = document.getElementById("comments");
    const genderElement = document.getElementById("gender");
    const addressElement = document.getElementById("address");
    const userTypeElement = document.getElementById("user_type");

    if (userTypeElem.value === "doggy-sitter") {
        costElement = document.getElementById("cost");
        experienceElement = document.getElementById("experience");
    }

    if (check_inputs(userTypeElem.value)) {
        let payload = {
            fullname: fullnameElement.value,
            email: emailElement.value,
            password: passElement.value,
            birthdate: bdateElement.value,
            comments: commentsElement.value,
            gender: genderElement.value,
            address: addressElement.value,
            user_type: userTypeElement.value,
        };

        if (userTypeElem.value === "doggy-sitter") {
            payload.cost = costElement.value;
            payload.experience = experienceElement.value;
        }

        fetch(`${BASE_SERVER_API_URL}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
            .then((response) => response.json())
            .then((response) => {
                if (response.status === "success") {
                    window.location = "sign-in.html";
                } else {
                    alert("Error while creating new user!");
                }
            })
            .catch((e) => {
                console.log(e);
                alert("A server error occurred");
            });
    }
}

function check_inputs(userType) {
    if (
        !document.getElementById("full_name").value ||
        !document.getElementById("user_email").value ||
        !document.getElementById("pass").value ||
        !document.getElementById("Bdate").value ||
        !document.getElementById("comments").value ||
        !document.getElementById("gender").value ||
        !document.getElementById("address").value ||
        !document.getElementById("user_type").value
    ) {
        alert("Some fields are missing!");
        return false;
    }

    if (userType === "doggy-sitter") {
        if (
            !document.getElementById("cost").value ||
            !document.getElementById("experience").value
        ) {
            alert("Some fields are missing!");
            return false;
        }
    }

    var check_fullName = check_str_onlyLetters(
        document.getElementById("full_name").value
    );

    if (!check_fullName) {
        alert("Only English letters are allowed for fullname");
        return false;
    }

    if (!["male", "female"].includes(document.getElementById("gender").value)) {
        alert("Gender is malformed");
        return false;
    }

    if (
        !["Consumer", "doggy-sitter"].includes(
            document.getElementById("user_type").value
        )
    ) {
        alert("User type is malformed");
        return false;
    }

    return true;
}

function check_str_onlyLetters(name) {
    return /^[a-zA-Z\s]*$/i.test(name);
}

/******************************GEO LOCATION************************** */

const findMyLocation = () => {
    const status = document.querySelector(".status");

    const success = (position) => {
        console.log(position);
    };

    const error = () => {
        place.textContent = "Unable to retrieve your location";
    };

    navigator.geolocation.getCurrentPosition(seccess, error);
};

const findStateElem = document.querySelector(".find-state");
if (findStateElem) {
    findStateElem.addEventListener("click", findMyLocation);
}

// Check if user loggedIn
const loggedInUserListItemElem = document.getElementById("logged-in-user-item");
if (loggedInUserListItemElem && sessionStorage.getItem("LOGGED_IN_USER")) {
    const user = JSON.parse(sessionStorage.getItem("LOGGED_IN_USER"));
    loggedInUserListItemElem.innerHTML = `
        <span class="navbar__links" onclick="window.location = 'profile.html'">Hey, ${user.fullname}</span> 
        <button class="button" id="signup" onclick="logout()">Logout</button>
    `;

    const profileForm = document.getElementById("my-user-form");
    if (profileForm) {
        document.getElementById("full_name").value=user.fullname;
        document.getElementById("user_email").value = user.email;
        document.getElementById("pass").value = user.password;
        document.getElementById("Bdate").value = user.birthdate;
        document.getElementById("comments").value = user.comments;
        document.getElementById("gender").value = user.gender;
        document.getElementById("address").value = user.address;
        document.getElementById("user_type").value = user.user_type;

        if (document.getElementById("user_type").value === "doggy-sitter") {
            document.getElementById("cost").value = user.cost;
            document.getElementById("experience").value = user.experience;
        }

        document.querySelector('.update-btn').addEventListener("click", updateUserDetails);
        document.querySelector('.remove-btn').addEventListener("click", removeUser);
    }
}

function updateUserDetails() {
    const user = JSON.parse(sessionStorage.getItem("LOGGED_IN_USER"));

    let costElement;
    let experienceElement;

    const fullnameElement = document.getElementById("full_name");
    const emailElement = document.getElementById("user_email");
    const passElement = document.getElementById("pass");
    const bdateElement = document.getElementById("Bdate");
    const commentsElement = document.getElementById("comments");
    const genderElement = document.getElementById("gender");
    const addressElement = document.getElementById("address");
    const userTypeElement = document.getElementById("user_type");

    if (userTypeElem.value === "doggy-sitter") {
        costElement = document.getElementById("cost");
        experienceElement = document.getElementById("experience");
    }

    if (check_inputs(userTypeElem.value)) {
        let payload = {
            fullname: fullnameElement.value,
            email: emailElement.value,
            password: passElement.value,
            birthdate: bdateElement.value,
            comments: commentsElement.value,
            gender: genderElement.value,
            address: addressElement.value,
            user_type: userTypeElement.value,
        };

        if (userTypeElem.value === "doggy-sitter") {
            payload.cost = costElement.value;
            payload.experience = experienceElement.value;
        }

        fetch(`${BASE_SERVER_API_URL}/users/${user.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
            .then((response) => response.json())
            .then((response) => {
                sessionStorage.setItem("LOGGED_IN_USER", JSON.stringify(response));
                window.location.reload();
            })
            .catch((e) => {
                console.log(e);
                alert("A server error occurred");
            });
    }
}

function removeUser() {
    const user = JSON.parse(sessionStorage.getItem("LOGGED_IN_USER"));
    const res = confirm('Are you sure about removing your profile?');
    if (res) {
        fetch(`${BASE_SERVER_API_URL}/users/${user.id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => response.json())
            .then(() => {
                sessionStorage.clear();
                window.location = 'sign-in.html';
            })
            .catch((e) => {
                console.log(e);
                alert("A server error occurred");
            });
    }

}

function logout() {
    sessionStorage.removeItem("LOGGED_IN_USER");
    window.location = "sign-in.html";
}

const userTypeElem = document.querySelector(".form-group #user_type");
if (userTypeElem) {
    userTypeElem.addEventListener("change", changeUserTypeSignUpFields);
}

function changeUserTypeSignUpFields(event) {
    if (event.target.value === "Consumer") {
        document.getElementById("cost-input").style.display = "none";
        document.getElementById("experience-input").style.display = "none";
    } else if (event.target.value === "doggy-sitter") {
        document.getElementById("cost-input").style.display = "block";
        document.getElementById("experience-input").style.display = "block";
    }
}

async function search(event) {
    event.preventDefault();
    const user = JSON.parse(sessionStorage.getItem("LOGGED_IN_USER"));
    const maxDistanceElement = document.getElementById("max-distance");
    const maxCostElement = document.getElementById("max-cost");
    const dogSizeElement = document.getElementById("dog-size");
    const reqExpElement = document.getElementById("experience");

    if (!maxDistanceElement.value || !maxCostElement.value || !dogSizeElement.value || !reqExpElement.value) {
        alert("Some fields are missing!");
        return false;
    }

    fetch(
        `${BASE_SERVER_API_URL}/users?user_type=doggy-sitter&experience=${reqExpElement.value}&max_cost=${maxCostElement.value}&dog_size=${dogSizeElement.value}`,
        {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        }
    )
        .then((response) => response.json())
        .then(async (response) => {
            if (response.length > 0) {
                const matches = [];
                for (let doggyMister of response.data) {
                    const response = await calculateDistances(user.address, doggyMister.address);
                    var directionsData = response.routes[0].legs[0];
                    if ((directionsData.distance.value / 1000) <= maxDistanceElement.value) {
                        doggyMister.distance = (directionsData.distance.value / 1000);
                        matches.push(doggyMister);
                    }
                }

                sessionStorage.setItem("MATCHES", JSON.stringify(matches));
                window.location = 'search-results.html';
            } else {
                alert("No doggy misters was found for the given params!");
            }
        })
        .catch((e) => {
            console.log(e);
            alert("A server error occurred");
        });    
}

async function calculateDistances(origin, destination) {
    let directionsService = new google.maps.DirectionsService();
    const route = {
        origin,
        destination,
        travelMode: "DRIVING",
    };

    return directionsService.route(route, function (response, status) {
        // anonymous function to capture directions
        if (status !== "OK") {
            window.alert("Directions request failed due to " + status);
            return;
        } else {
            var directionsData = response.routes[0].legs[0]; // Get data about the mapped route
            if (!directionsData) {
                window.alert("Directions request failed");
                return;
            } else {
                return directionsData.distance.value;
            }
        }
    });
}