const APIURL = 'https://api.github.com/users/';

const form = document.querySelector('form');
const search = document.querySelector('form > input');

const main = document.getElementById('main');

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const value = search.value;

    main.innerHTML = '';

    const data = await getUserData(value);
    if (data) createUserCard(data);
    else createErrorCard();

    const repos = await getUserRepos(value);
    if (repos) addReposToCard(repos);
});

async function getUserRepos(username) {
    try {
        const res = await axios.get(APIURL + username + '/repos?sort=created');
        // console.log(res.data);
        return res.data;
    } catch (err) {
        return null;
    }
}

async function getUserData(username) {

    try {
        const res = await axios.get(APIURL + username);
        // console.log(res.data);
        return res.data;
    } catch (err) {
        return null;
    }
}

function createUserCard(user) {
    const div = document.createElement('div');
    div.classList.add('card');

    const twitterLink = `https://twitter.com/${user.twitter_username}`;

    div.innerHTML = `
        <div class="profile">
                <img src=${user.avatar_url} alt="" class="avatar">
                <div class="social-profiles">
                    <a href=${user.html_url} target="_blank"><img src="./icons/github.svg" alt=""></a>
                    <a href=${user.twitter_username !== null ? twitterLink : ""} target="_blank"><img src="./icons/twitter.svg" alt="" class=${user.twitter_username !== null ? "" : "disabled"}></a>
                    <a href=${user.blog !== "" ? user.blog : ""} target="_blank"><img src="./icons/post.svg" alt="" class=${user.blog !== "" ? "" : "disabled"}></a>
                </div>
            </div>
            <div class="user-info">
                <h2>${user.name === null ? user.login : user.name}</h2>
                <p>${user.bio !== null ? user.bio : "No Bio."}</p>

                <ul>
                    <li>${user.public_repos} repositories</li>
                    <li>${user.followers} Followers</li>
                    <li>${user.following} Following</li>
                </ul>

                <div class="repos">
                </div>
            </div>
    `;

    main.append(div);
}

function createErrorCard() {
    const div = document.createElement('div');
    div.classList.add('card', 'error');
    div.innerText = "No Profile found!";
    main.append(div);
}

function addReposToCard(repos) {
    const reposEle = document.querySelector('.repos');

    repos
        .slice(0, 5)
        .forEach(repo => {
        const repoEle = document.createElement('a');
        repoEle.href = repo.html_url;
        repoEle.classList.add('repo');
        repoEle.innerText = repo.name;
        repoEle.target = "_blank";

        reposEle.appendChild(repoEle);
    });
}