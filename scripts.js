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
  }

  gepelesEffekt();
  adatokBetoltese();
});