
(function () {
    const VIDEO_ID = "2mJXVrELK3Q";

    const turntable = document.getElementById("turntable");
    const btn = document.getElementById("turntableBtn");
    const ytContainer = document.getElementById("turntableYouTube");
    const tooltip = document.getElementById("turntableTooltip");

    if (!turntable || !btn || !ytContainer) return;

    let player = null;
    let pendingPlay = false; // si el usuario da clic antes de que la API cargue

    /* --- 0. Traer título y canal del video con la API pública de oEmbed --- */
    function loadTrackInfo() {
        if (!tooltip) return;

        const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${VIDEO_ID}&format=json`;

        fetch(url)
        .then((res) => {
            if (!res.ok) throw new Error("No se pudo obtener la información del video");
            return res.json();
        })
        .then((data) => {
            const title = escapeHtml(data.title || "Canción");
            const author = escapeHtml(data.author_name || "");
            tooltip.innerHTML = `<strong>${title}</strong><span>${author}</span>`;
        })
        .catch(() => {
            // Si falla (sin internet, video privado, etc.) mostramos un texto genérico
            tooltip.innerHTML = `<strong>Música de fondo</strong><span>Click para reproducir</span>`;
        });
    }

    function escapeHtml(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }

    /* --- 1. Cargar el script de la API de YouTube (una sola vez) --- */
    function loadYouTubeAPI() {
        if (window.YT && window.YT.Player) {
        createPlayer();
        return;
        }

        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);

        // Esta función la llama automáticamente la API de YouTube cuando termina de cargar
        window.onYouTubeIframeAPIReady = function () {
        createPlayer();
        };
    }

    /* --- 2. Crear el reproductor oculto --- */
    function createPlayer() {
        player = new YT.Player(ytContainer.id, {
        height: "1",
        width: "1",
        videoId: VIDEO_ID,
        playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            loop: 1,
            playlist: VIDEO_ID, // necesario para que el loop funcione en YouTube
        },
        events: {
            onReady: function () {
            if (pendingPlay) {
                player.playVideo();
                pendingPlay = false;
            }
            },
            onStateChange: onPlayerStateChange,
        },
        });
    }

    /* --- 3. Actualizar el ícono/animación según el estado real del video --- */
    function onPlayerStateChange(event) {
        if (event.data === YT.PlayerState.PLAYING) {
        turntable.classList.add("is-playing");
        btn.setAttribute("aria-pressed", "true");
        btn.setAttribute("aria-label", "Pausar música de fondo");
        } else {
        turntable.classList.remove("is-playing");
        btn.setAttribute("aria-pressed", "false");
        btn.setAttribute("aria-label", "Reproducir música de fondo");
        }
    }

    /* --- 4. Click del disco: reproducir / pausar --- */
    btn.addEventListener("click", function () {
        // Si la API todavía no cargó, la cargamos ahora (con el primer clic)
        if (!player) {
        pendingPlay = true;
        loadYouTubeAPI();
        return;
        }

        const state = player.getPlayerState();
        if (state === YT.PlayerState.PLAYING) {
        player.pauseVideo();
        } else {
        player.playVideo();
        }
    });

    // Traemos el título y autor desde ya, para que el tooltip funcione
    // aunque el usuario todavía no le haya dado clic al disco.
    loadTrackInfo();
})();