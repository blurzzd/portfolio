const translations = {
    hu: {
        title: "Heloo HU",
    },

    en: {
        title: "Hello EN",
    }
};

let currentLanguage = localStorage.getItem("language") || "hu";

function changeLanguage(lang) {
    currentLanguage = lang;

    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach(element => {
        const key = element.dataset.i18n;
        element.textContent = translations[lang][key];
    });

    document.getElementById("languageButton").textContent =
        lang === "hu" ? "🇬🇧 EN" : "🇭🇺 HU";

    localStorage.setItem("language", lang);
}

function toggleLanguage() {
    const newLanguage = currentLanguage === "hu" ? "en" : "hu";
    changeLanguage(newLanguage);
}

changeLanguage(currentLanguage);

document.addEventListener("DOMContentLoaded", () => {
  const racsKontener = document.getElementById("racs-kontener");
  const gepeltSzovegElem = document.getElementById("gepelt-szoveg");
  const discordPfp = document.getElementById("discord-pfp");
  const discordDecoration = document.getElementById("discord-decoration");
  const discordDisplayName = document.getElementById("discord-displayname");
  const discordClanTag = document.getElementById("discord-clan-tag");
  const discordBadges = document.getElementById("discord-badges");
  const discordIndicator = document.getElementById("discord-indicator");
  const discordActivity = document.getElementById("discord-activity");
  
  const spotifyStatus = document.getElementById("spotify-status");
  const spotifyCover = document.getElementById("spotify-cover");
  const spotifySong = document.getElementById("spotify-song");
  const spotifyArtist = document.getElementById("spotify-artist");

  const customCursor = document.getElementById("custom-cursor");

  const DISCORD_USER_ID = "1235266616351260742"; 

  window.addEventListener("mousemove", e => {
    customCursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
  });

  const interaktivElemek = document.querySelectorAll("a, button, .dontheto-doboz, .rolam-doboz");
  interaktivElemek.forEach(elem => {
    elem.addEventListener("mouseenter", () => {
      customCursor.style.width = "22px";
      customCursor.style.height = "22px";
      customCursor.style.backgroundColor = "rgba(0, 210, 255, 0.2)";
    });
    elem.addEventListener("mouseleave", () => {
      customCursor.style.width = "14px";
      customCursor.style.height = "14px";
      customCursor.style.backgroundColor = "#000000";
    });
  });

  const mondatok = [
    "Helló, én Blurzz vagyok.",
    "15 éves vagyok, és Szoftverfejlesztő és Tesztelő szakon tanulok.",
    "A legtöbb projektet HTML, CSS és JavaScript használatával készítem.",
    "Nézzmeg őket a lenti kockákban, és ha tetszik valamelyik, kattints a Forráskód gombra.",
  ];

  let mondatIndex = 0;
  let karakterIndex = 0;
  let torlesFolyamatban = false;

  function gepelesEffekt() {
    const jelenlegiMondat = mondatok[mondatIndex];

    if (torlesFolyamatban) {
      gepeltSzovegElem.textContent = jelenlegiMondat.substring(0, karakterIndex - 1);
      karakterIndex--;
    } else {
      gepeltSzovegElem.textContent = jelenlegiMondat.substring(0, karakterIndex + 1);
      karakterIndex++;
    }

    let gepelesSebesseg = torlesFolyamatban ? 50 : 90;

    if (!torlesFolyamatban && karakterIndex === jelenlegiMondat.length) {
      gepelesSebesseg = 2000;
      torlesFolyamatban = true;
    } else if (torlesFolyamatban && karakterIndex === 0) {
      torlesFolyamatban = false;
      mondatIndex = (mondatIndex + 1) % mondatok.length;
      gepelesSebesseg = 500;
    }

    setTimeout(gepelesEffekt, gepelesSebesseg);
  }

  async function discordStátuszLekerese() {
    if (DISCORD_USER_ID === "YOUR_DISCORD_USER_ID_HERE") {
      discordActivity.textContent = "Offline / Set User ID";
      return;
    }

    try {
      const valasz = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`);
      const adatok = await valasz.json();

      if (adatok.success) {
        const felhasznalo = adatok.data.discord_user;
        const statusz = adatok.data.discord_status;
        const aktivitások = adatok.data.activities;
        const spotify = adatok.data.spotify;

        discordDisplayName.textContent = felhasznalo.global_name || felhasznalo.display_name || felhasznalo.username;

        if (felhasznalo.avatar) {
          discordPfp.src = `https://cdn.discordapp.com/avatars/${felhasznalo.id}/${felhasznalo.avatar}.png`;
        }

        if (felhasznalo.avatar_decoration_data) {
          const díszAsset = felhasznalo.avatar_decoration_data.asset;
          discordDecoration.src = `https://cdn.discordapp.com/avatar-decoration-presets/${díszAsset}.png`;
          discordDecoration.style.display = "block";
        } else {
          discordDecoration.style.display = "none";
        }

        if (felhasznalo.clan || felhasznalo.primary_guild) {
          const klanTag = (felhasznalo.clan && felhasznalo.clan.tag) || (felhasznalo.primary_guild && felhasznalo.primary_guild.tag);
          if (klanTag) {
            discordClanTag.textContent = klanTag;
            discordClanTag.style.display = "inline-block";
          }
        } else {
          discordClanTag.style.display = "none";
        }

        discordBadges.innerHTML = "";
        if (felhasznalo.public_flags) {
          const jelvények = [
            { flag: 1 << 0, icon: "https://cdn.discordapp.com/badge-icons/8a882641373ccd87572c290e7401056a.png" },
            { flag: 1 << 2, icon: "https://cdn.discordapp.com/badge-icons/70d497e96704618610643030bfe9af90.png" },
            { flag: 1 << 6, icon: "https://cdn.discordapp.com/badge-icons/bf01d357324e03fbe400d1b96a060d41.png" },
            { flag: 1 << 7, icon: "https://cdn.discordapp.com/badge-icons/9b31649fda558f44d8253160a0058b73.png" },
            { flag: 1 << 8, icon: "https://cdn.discordapp.com/badge-icons/45642a923d68427f7f017004f2f451f2.png" },
            { flag: 1 << 18, icon: "https://cdn.discordapp.com/badge-icons/6bd4563a24e475392d54020f3a96d2e9.png" }
          ];

          jelvények.forEach(b => {
            if ((felhasznalo.public_flags & b.flag) !== 0) {
              const img = document.createElement("img");
              img.src = b.icon;
              img.className = "discord-jelveny-ico";
              discordBadges.appendChild(img);
            }
          });
        }

        discordIndicator.className = "discord-jelzo";
        if (statusz === "online") discordIndicator.classList.add("status-online");
        else if (statusz === "idle") discordIndicator.classList.add("status-idle");
        else if (statusz === "dnd") discordIndicator.classList.add("status-dnd");
        else discordIndicator.classList.add("status-offline");

        const jatekotJatszik = aktivitások.find(a => a.type === 0);
        if (jatekotJatszik) {
          discordActivity.textContent = `Playing ${jatekotJatszik.name}`;
        } else if (aktivitások.length > 0) {
          discordActivity.textContent = aktivitások[0].name;
        } else {
          discordActivity.textContent = `Online`;
        }

        // Handle Spotify Now Playing via Lanyard
        if (adatok.data.listening_to_spotify && spotify) {
          spotifySong.textContent = spotify.song;
          spotifyArtist.textContent = spotify.artist;
          spotifyCover.src = spotify.album_art_url;
          spotifyStatus.style.display = "flex";
        } else {
          spotifyStatus.style.display = "none";
        }
      }
    } catch (hiba) {
      console.error("Hiba a Discord státusz lekérdezésekor:", hiba);
      discordActivity.textContent = "Offline";
    }
  }

  async function adatokBetoltese() {
    try {
      const valasz = await fetch("dobozok.json");
      const adatok = await valasz.json();

      racsKontener.innerHTML = "";

      adatok.forEach(elem => {
        const doboz = document.createElement("section");
        doboz.className = "dontheto-doboz";
        doboz.innerHTML = `
          <div>
            <h2>${elem.cim}</h2>
            <p>${elem.leiras}</p>
          </div>
          <a class="doboz-gomb" href="${elem.githubLink}" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24"><path d="M12.026 2c-5.509 0-9.974 4.465-9.974 9.974c0 4.406 2.857 8.145 6.821 9.465c.499.09.679-.217.679-.481c0-.237-.008-.865-.011-1.696c-2.775.602-3.361-1.338-3.361-1.338c-.452-1.152-1.107-1.459-1.107-1.459-.905-.619.069-.605.069-.605c1.002.07 1.527 1.028 1.527 1.028c.89 1.524 2.336 1.084 2.902.829c.091-.645.351-1.085.635-1.334c-2.214-.251-4.542-1.107-4.542-4.93c0-1.087.389-1.979 1.024-2.675c-.101-.253-.446-1.268.099-2.64c0 0 .837-.269 2.742 1.021a9.582 9.582 0 0 1 2.496-.336a9.554 9.554 0 0 1 2.496.336c1.906-1.291 2.742-1.021 2.742-1.021c.545 1.372.203 2.387.099 2.64c.64.696 1.024 1.587 1.024 2.675c0 3.833-2.33 4.675-4.552 4.922c.355.308.675.916.675 1.846c0 1.334-.012 2.41-.012 2.737c0 .267.178.577.687.479C19.146 20.115 22 16.379 22 11.974C22 6.465 17.535 2 12.026 2z"/></svg>
            Forráskód
          </a>
        `;
        racsKontener.appendChild(doboz);
      });

      haromdDontesBeallitasa();
    } catch (hiba) {
      console.error("Hiba történt a JSON betöltésekor:", hiba);
    }
  }

  function haromdDontesBeallitasa() {
    const dobozok = document.querySelectorAll(".dontheto-doboz, .rolam-doboz");
    const mozgasCsokkentve = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (mozgasCsokkentve) return;

    dobozok.forEach(doboz => {
      doboz.addEventListener("pointermove", esemeny => {
        const tartomany = doboz.getBoundingClientRect();
        const x = (esemeny.clientX - tartomany.left) / tartomany.width;
        const y = (esemeny.clientY - tartomany.top) / tartomany.height;
        const forgatasY = (x - 0.5) * 28;
        const forgatasX = (0.5 - y) * 28;

        doboz.style.transition = "transform 50ms linear, border-color 300ms ease, box-shadow 300ms ease";
        doboz.style.transform = `perspective(1000px) rotateX(${forgatasX}deg) rotateY(${forgatasY}deg) scale3d(1.02, 1.02, 1.02)`;
      });

      doboz.addEventListener("pointerleave", () => {
        doboz.style.transition = "transform 700ms cubic-bezier(0.03, 0.98, 0.52, 0.99), border-color 300ms ease, box-shadow 300ms ease";
        doboz.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
      });
    });

    if (window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", esemeny => {
        const gamma = esemeny.gamma;
        const beta = esemeny.beta;

        if (gamma !== null && beta !== null) {
          const forgatasY = Math.max(Math.min(gamma * 0.6, 15), -15);
          const forgatasX = Math.max(Math.min((beta - 45) * 0.6, 15), -15);

          dobozok.forEach(doboz => {
            doboz.style.transition = "transform 50ms linear";
            doboz.style.transform = `perspective(1000px) rotateX(${forgatasX}deg) rotateY(${forgatasY}deg) scale3d(1.02, 1.02, 1.02)`;
          });
        }
      }, true);
    }
  }

  gepelesEffekt();
  adatokBetoltese();
  discordStátuszLekerese();
  setInterval(discordStátuszLekerese, 10000);
});
