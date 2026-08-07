async function loadTheme() {

    const token = localStorage.getItem("token");

    if (!token) return;

    try {

        const response = await fetch("/api/auth/me", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) return;

        const user = await response.json();

        applyTheme(user.selectedTheme);

    } catch (err) {

        console.error(err);

    }

}

function applyTheme(theme){

    const root = document.documentElement;

    switch(theme){

        case "Ocean Theme":
            root.style.setProperty("--primary-green","#1976d2");
            root.style.setProperty("--light-bg","#e3f2fd");
            root.style.setProperty("--dark-neutral","#0d47a1");
            break;

        case "Sunset Theme":
            root.style.setProperty("--primary-green","#ff7043");
            root.style.setProperty("--light-bg","#fff3e0");
            root.style.setProperty("--dark-neutral","#4e342e");
            break;

        case "Midnight Theme":
            root.style.setProperty("--primary-green","#455a64");
            root.style.setProperty("--light-bg","#263238");
            root.style.setProperty("--dark-neutral","#ffffff");
            break;

        case "Sakura Theme":
            root.style.setProperty("--primary-green","#ec407a");
            root.style.setProperty("--light-bg","#fce4ec");
            root.style.setProperty("--dark-neutral","#880e4f");
            break;

        default:
            root.style.setProperty("--primary-green","#2e7d32");
            root.style.setProperty("--light-bg","#f4f7f6");
            root.style.setProperty("--dark-neutral","#2c3e50");
    }

}

loadTheme();
