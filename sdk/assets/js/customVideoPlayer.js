function customVideoPlayer() {

    let videoElement;

    const playBase64Img = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPHN2ZyBmaWxsPSIjZmZmIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyI+DQoJPGc+DQoJCTxwYXRoIGQ9Ik00Ny4xMjcsMHY1MTJsNDE3Ljc0NS0yNTQuODM3TDQ3LjEyNywweiBNODcuMTcyLDcxLjY3NmwzMDEuMDYsMTg1LjMzM0w4Ny4xNzIsNDQwLjY2NFY3MS42NzZ6Ii8+DQoJPC9nPg0KPC9zdmc+';
    const pauseBase64Img = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPHN2ZyBmaWxsPSIjZmZmIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyI+DQoJPGc+DQoJCTxwYXRoIGQ9Ik0xNTQsMEg3MEM0Mi40MywwLDIwLDIyLjQzLDIwLDUwdjQxMmMwLDI3LjU3LDIyLjQzLDUwLDUwLDUwaDg0YzI3LjU3LDAsNTAtMjIuNDMsNTAtNTBWNTBDMjA0LDIyLjQzLDE4MS41NywwLDE1NCwweiBNMTY0LDQ2MmMwLDUuNTE0LTQuNDg2LDEwLTEwLDEwSDcwYy01LjUxNCwwLTEwLTQuNDg2LTEwLTEwVjUwYzAtNS41MTQsNC40ODYtMTAsMTAtMTBoODRjNS41MTQsMCwxMCw0LjQ4NiwxMCwxMFY0NjJ6IiAvPg0KCTwvZz4NCgk8Zz4NCgkJPHBhdGggZD0iTTQ0MiwwaC04NGMtMjcuNTcsMC01MCwyMi40My01MCw1MHY0MTJjMCwyNy41NywyMi40Myw1MCw1MCw1MGg4NGMyNy41NywwLDUwLTIyLjQzLDUwLTUwVjUwQzQ5MiwyMi40Myw0NjkuNTcsMCw0NDIsMHogTTQ1Miw0NjJjMCw1LjUxNC00LjQ4NiwxMC0xMCwxMGgtODRjLTUuNTE0LDAtMTAtNC40ODYtMTAtMTBWNTBjMC01LjUxNCw0LjQ4Ni0xMCwxMC0xMGg4NGM1LjUxNCwwLDEwLDQuNDg2LDEwLDEwVjQ2MnoiIC8+DQoJPC9nPg0KPC9zdmc+';
    const stopBase64Img = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPHN2ZyBmaWxsPSIjZmZmIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyI+DQoJPGc+DQoJCTxwYXRoIGQ9Ik00NTIsMEg2MEMyNi45MTYsMCwwLDI2LjkxNiwwLDYwdjM5MmMwLDMzLjA4NCwyNi45MTYsNjAsNjAsNjBoMzkyYzMzLjA4NCwwLDYwLTI2LjkxNiw2MC02MFY2MCBDNTEyLDI2LjkxNiw0ODUuMDg0LDAsNDUyLDB6IE00NzIsNDUyYzAsMTEuMDI4LTguOTcyLDIwLTIwLDIwSDYwYy0xMS4wMjgsMC0yMC04Ljk3Mi0yMC0yMFY2MGMwLTExLjAyOCw4Ljk3Mi0yMCwyMC0yMGgzOTIgYzExLjAyOCwwLDIwLDguOTcyLDIwLDIwVjQ1MnoiLz4NCgk8L2c+DQo8L3N2Zz4=';
    const rewindBase64Img = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPHN2ZyBmaWxsPSIjZmZmIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyI+DQoJPGc+DQoJCTxwYXRoIGQ9Ik0yNzUuMTE5LDIyMi44ODFWMjYuOTM4TDAsMjU1LjM4NmwyNzUuMTE5LDIyOS42NzZWMjg4LjA2NUw1MTIsNDg0Ljk0VjI3LjA1OUwyNzUuMTE5LDIyMi44ODF6IE0yMzUuMTQsMzk5LjYwNCBMMjM1LjE0LDM5OS42MDRMNjIuNDg0LDI1NS40NjhMMjM1LjE0LDExMi4xMDJWMzk5LjYwNHogTTQ3Mi4wMiwzOTkuNzI2TDI5OC40NDcsMjU1LjQ2OEw0NzIuMDIsMTExLjk4MVYzOTkuNzI2eiIvPg0KCTwvZz4NCjwvc3ZnPg==';
    const forwardBase64Img = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPHN2ZyBmaWxsPSIjZmZmIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyI+DQoJPGc+DQoJCTxwYXRoIGQ9Ik01MTIsMjU1LjM4N0wyMzYuODgxLDI2LjkzOXYxOTUuOTQzTDAsMjcuMDZ2NDU3Ljg3OWwyMzYuODgxLTE5Ni44NzR2MTk2Ljk5Nkw1MTIsMjU1LjM4N3ogTTI3Ni44NiwxMTIuMTAzIGwxNzIuNjU1LDE0My4zNjZMMjc2Ljg2LDM5OS42MDVWMTEyLjEwM3ogTTM5Ljk4LDM5OS43MjdWMTExLjk4MmwxNzMuNTczLDE0My40ODdMMzkuOTgsMzk5LjcyN3oiLz4NCgk8L2c+DQo8L3N2Zz4=';
    const enterFullscreenBase64Img = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPHN2ZyBmaWxsPSIjZmZmIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyI+DQoJPGc+DQoJCTxwb2x5Z29uIHBvaW50cz0iNjguMjg0LDQwIDE2NSw0MCAxNjUsMCAwLDAgMCwxNjUgNDAsMTY1IDQwLDY4LjI4NCAxNzcsMjA1LjI4NCAyMDUuMjg0LDE3NyIgLz4NCgk8L2c+DQoJPGc+DQoJCTxwb2x5Z29uIHBvaW50cz0iMjA1LjI4NCwzMzUgMTc3LDMwNi43MTYgNDAsNDQzLjcxNiA0MCwzNDcgMCwzNDcgMCw1MTIgMTY1LDUxMiAxNjUsNDcyIDY4LjI4NCw0NzIiIC8+DQoJPC9nPg0KCTxnPg0KCQk8cG9seWdvbiBwb2ludHM9IjM0NywwIDM0Nyw0MCA0NDMuNzE2LDQwIDMwNi43MTYsMTc3IDMzNSwyMDUuMjg0IDQ3Miw2OC4yODQgNDcyLDE2NSA1MTIsMTY1IDUxMiwwIiAvPg0KCTwvZz4NCgk8Zz4NCgkJPHBvbHlnb24gcG9pbnRzPSI0NzIsMzQ3IDQ3Miw0NDMuNzE2IDMzNSwzMDYuNzE2IDMwNi43MTYsMzM1IDQ0My43MTYsNDcyIDM0Nyw0NzIgMzQ3LDUxMiA1MTIsNTEyIDUxMiwzNDciIC8+DQoJPC9nPg0KPC9zdmc+';
    const exitFullscreenBase64Img = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPHN2ZyBmaWxsPSIjZmZmIiB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyI+DQoJPGc+DQoJCTxwb2x5Z29uIHBvaW50cz0iMzc1LjE1MiwzNDYuODk5IDQ3MS43NjEsMzQ2Ljg5OSA0NzEuNzYxLDMwNi45NDMgMzA2Ljk0MywzMDYuOTQzIDMwNi45NDMsNDcxLjc2MSAzNDYuODk5LDQ3MS43NjEgMzQ2Ljg5OSwzNzUuMTUyIDQ4My43NDcsNTEyIDUxMiw0ODMuNzQ3Ii8+DQoJPC9nPg0KCTxnPg0KCQk8cG9seWdvbiBwb2ludHM9IjUxMiwyOC4yNTMgNDgzLjc0NywwIDM0Ni44OTksMTM2Ljg0OCAzNDYuODk5LDQwLjIzOSAzMDYuOTQzLDQwLjIzOSAzMDYuOTQzLDIwNS4wNTcgNDcxLjc2MSwyMDUuMDU3IDQ3MS43NjEsMTY1LjEwMSAzNzUuMTUyLDE2NS4xMDEiLz4NCgk8L2c+DQoJPGc+DQoJCTxwb2x5Z29uIHBvaW50cz0iNDAuMjM5LDMwNi45NDMgNDAuMjM5LDM0Ni44OTkgMTM2Ljg0OCwzNDYuODk5IDAsNDgzLjc0NyAyOC4yNTMsNTEyIDE2NS4xMDEsMzc1LjE1MiAxNjUuMTAxLDQ3MS43NjEgMjA1LjA1Nyw0NzEuNzYxIDIwNS4wNTcsMzA2Ljk0MyIvPg0KCTwvZz4NCgk8Zz4NCgkJPHBvbHlnb24gcG9pbnRzPSIxNjUuMTAxLDQwLjIzOSAxNjUuMTAxLDEzNi44NDggMjguMjUzLDAgMCwyOC4yNTMgMTM2Ljg0OCwxNjUuMTAxIDQwLjIzOSwxNjUuMTAxIDQwLjIzOSwyMDUuMDU3IDIwNS4wNTcsMjA1LjA1NyAyMDUuMDU3LDQwLjIzOSIvPg0KCTwvZz4NCjwvc3ZnPg==';


    /**
     * @function init
     * @description
     * @public
     * @returns {void}
     */
    function init() {
        const videoSupported = !!document.createElement('video').canPlayType;
        const initialized = document.getElementById('videoWrapper');
        videoElement = document.getElementsByTagName('video')[0];

        if (videoSupported && videoElement && !initialized) {
            buildCustomControl(videoElement, function() {
                updateDurationContainer(0, videoElement.duration | 0);
            });
        }
    }

    /**
     * @function buildCustomControl
     * @description
     * @public
     * @param {HTMLVideoElement} videoElement
     * @param {Function} callback
     * @returns {void}
     */
    function buildCustomControl(videoElement, callback) {

        let isFullscreen = false;

        /**
         * Hidding default controls
         */
        videoElement.controls = false;

        /**
         * Wrapping the original video element within a global video wrapper
         */
        const videoWrapper = document.createElement('div');
        videoWrapper.id = 'videoWrapper';
        // Copying style elements in videoWrapper element to match the original video element style
        const computedStyle = getComputedStyle(videoElement);
        videoWrapper.style = computedStyle;
        /*const videoWrapperStyle = {
            position: computedStyle.position ? computedStyle.position : videoElement.style.position,
            top: computedStyle.top ? computedStyle.top : videoElement.style.top,
            right: computedStyle.right ? computedStyle.right : videoElement.style.right,
            bottom: computedStyle.bottom ? computedStyle.bottom : videoElement.style.bottom,
            left: computedStyle.left ? computedStyle.left : videoElement.style.left,
            float: computedStyle.float ? computedStyle.float : videoElement.style.float,
            margin: computedStyle.margin ? computedStyle.margin : videoElement.style.margin,
            padding: computedStyle.padding ? computedStyle.padding : videoElement.style.padding,
            width: computedStyle.width ? computedStyle.width : videoElement.style.width,
            height: computedStyle.height ? computedStyle.height : videoElement.style.height
        };
        for (let prop in videoWrapperStyle) {
            videoWrapper.style[prop] = videoWrapperStyle[prop];
        }*/
        videoElement.parentNode.insertBefore(videoWrapper, videoElement);
        videoWrapper.appendChild(videoElement);

        /**
         * Creating video controls HTML elements
         */
            // Video controls wrapper
        const videoControlsWrapper = document.createElement('ul');
        videoControlsWrapper.id = 'videoControls';
        videoControlsWrapper.style.position = 'relative';
        videoControlsWrapper.style.margin = '-4px 0 0 0';
        videoControlsWrapper.style.padding = 0;
        videoControlsWrapper.style.width = '100%';
        videoControlsWrapper.style.height = '32px';
        videoControlsWrapper.style.backgroundColor = 'rgba(0, 0, 0, 0.75)'; // '#15346b';
        // videoControlsWrapper.style.backgroundImage = 'linear-gradient(90deg, #15346b, #2a1b4d)';
        videoControlsWrapper.style.listStyle = 'none';

        // Play/Pause button
        const playPauseBtnWrapper = document.createElement('li');
        const playPauseBtn = document.createElement('button');
        playPauseBtnWrapper.classList.add('button');
        getCommonActionWrapperProperties(playPauseBtnWrapper);
        getCommonVideoBtnProperties(playPauseBtn);
        playPauseBtn.id = 'playPauseBtn';
        playPauseBtn.style.backgroundImage = 'url(' + playBase64Img + ')';
        playPauseBtnWrapper.appendChild(playPauseBtn);
        videoControlsWrapper.appendChild(playPauseBtnWrapper);

        // Stop button
        const stopBtnWrapper = document.createElement('li');
        const stopBtn = document.createElement('button');
        stopBtnWrapper.classList.add('button');
        getCommonActionWrapperProperties(stopBtnWrapper);
        getCommonVideoBtnProperties(stopBtn);
        stopBtn.id = 'stopBtn';
        stopBtn.style.backgroundImage = 'url(' + stopBase64Img + ')';
        stopBtnWrapper.appendChild(stopBtn);
        videoControlsWrapper.appendChild(stopBtnWrapper);

        // Rewind button
        const rewindBtnWrapper = document.createElement('li');
        const rewindBtn = document.createElement('button');
        rewindBtnWrapper.classList.add('button');
        getCommonActionWrapperProperties(rewindBtnWrapper);
        getCommonVideoBtnProperties(rewindBtn);
        rewindBtn.id = 'rewindBtn';
        rewindBtn.style.backgroundImage = 'url(' + rewindBase64Img + ')';
        rewindBtnWrapper.appendChild(rewindBtn);
        videoControlsWrapper.appendChild(rewindBtnWrapper);

        // Forward button
        const forwardBtnWrapper = document.createElement('li');
        const forwardBtn = document.createElement('button');
        forwardBtnWrapper.classList.add('button');
        getCommonActionWrapperProperties(forwardBtnWrapper);
        getCommonVideoBtnProperties(forwardBtn);
        forwardBtn.id = 'forwardBtn';
        forwardBtn.style.backgroundImage = 'url(' + forwardBase64Img + ')';
        forwardBtnWrapper.appendChild(forwardBtn);
        videoControlsWrapper.appendChild(forwardBtnWrapper);

        // Progress bar
        const progressBarWrapper = document.createElement('li');
        const progressBarContainer = document.createElement('div');
        const progressBar = document.createElement('span');
        getCommonActionWrapperProperties(progressBarWrapper);
        progressBarWrapper.style.width = '40%';
        progressBarWrapper.style.paddingLeft = '4px';
        progressBarWrapper.style.paddingRight = '4px';
        progressBarContainer.id = 'progressBarContainer';
        progressBarContainer.value = 0;
        progressBarContainer.min = 0;
        progressBarContainer.style.marginTop = '13px';
        progressBarContainer.style.marginBottom = '13px';
        progressBarContainer.style.height = '6px';
        progressBarContainer.style.width = '100%';
        progressBarContainer.style.backgroundColor = 'transparent';
        progressBarContainer.style.cursor = 'pointer';
        progressBarContainer.style.webkitAppearance = 'none';
        progressBarContainer.style.mozAppearance = 'none';
        progressBar.id = 'progressBar';
        progressBar.style.width = 0;
        progressBar.style.height = '6px';
        progressBar.style.display = 'block';
        progressBar.style.backgroundColor = '#299ffd';

        // Overriding style for full width thin progress bar
        progressBarWrapper.style.position = 'absolute';
        progressBarWrapper.style.top = 0;
        progressBarWrapper.style.left = 0;
        progressBarWrapper.style.width = '100%';
        progressBarWrapper.style.height = '2px';
        progressBarWrapper.style.padding = 0;
        progressBarContainer.style.marginTop = 0;
        progressBarContainer.style.marginBottom = 0;
        progressBarContainer.style.height = '2px';

        progressBarContainer.appendChild(progressBar);
        progressBarWrapper.appendChild(progressBarContainer);
        videoControlsWrapper.appendChild(progressBarWrapper);

        // Duration
        const durationWrapper = document.createElement('li');
        const durationContainer = document.createElement('span');
        getCommonActionWrapperProperties(durationWrapper, { width: 'auto' });
        durationWrapper.style.paddingLeft = '4px';
        durationWrapper.style.paddingRight = '4px';
        durationContainer.id = 'videoDuration';
        durationContainer.style.height = '32px';
        durationContainer.style.lineHeight = '32px';
        durationContainer.style.fontFamily = 'Arial';
        durationContainer.style.fontSize = '0.7rem';
        durationContainer.style.color = '#fff';
        durationContainer.style.display = 'block';
        durationWrapper.appendChild(durationContainer);
        videoControlsWrapper.appendChild(durationWrapper);

        // Fullscreen button
        const fullscreenBtnWrapper = document.createElement('li');
        const fullscreenBtn = document.createElement('button');
        fullscreenBtnWrapper.classList.add('button');
        getCommonActionWrapperProperties(fullscreenBtnWrapper, { float: 'right' });
        getCommonVideoBtnProperties(fullscreenBtn);
        fullscreenBtn.id = 'videoFullscreen';
        fullscreenBtn.style.backgroundImage = 'url(' + enterFullscreenBase64Img + ')';
        fullscreenBtnWrapper.appendChild(fullscreenBtn);
        videoControlsWrapper.appendChild(fullscreenBtnWrapper);

        // Wrapping video controls elements in the newly created global video wrapper
        videoWrapper.appendChild(videoControlsWrapper);

        // Pause overlay
        const overlay = document.createElement('div');
        const overlayPauseBtn = document.createElement('span');
        overlay.id = 'overlay';
        overlay.style.position = 'absolute';
        overlay.style.bottom = '32px'; // videoControlsWrapper height
        overlay.style.left = 0;
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
        overlay.style.cursor = 'pointer';
        overlay.style.display = 'none';
        /*// Done with CS rules
        overlay.addEventListener('mouseenter', function(event) {
          overlayPauseBtn.style.backgroundImage = 'url(' + overlayPlayBase64Img + ')';
        });
        overlay.addEventListener('mouseout', function(event) {
          if (event.toElement && event.toElement.id !== 'overlayPauseBtn' && event.fromElement && event.fromElement.id !== 'overlayPauseBtn') {
            overlayPauseBtn.style.backgroundImage = 'url(' + overlayPauseBase64Img + ')';
          }
        });*/
        overlayPauseBtn.id = 'overlayPauseBtn';
        overlayPauseBtn.style.position = 'absolute';
        overlayPauseBtn.style.top = 0;
        overlayPauseBtn.style.right = 0;
        overlayPauseBtn.style.bottom = 0;
        overlayPauseBtn.style.left = 0;
        overlayPauseBtn.style.margin = 'auto';
        overlayPauseBtn.style.width = '64px';
        overlayPauseBtn.style.height = '64px';
        overlayPauseBtn.style.backgroundRepeat = 'no-repeat';
        overlayPauseBtn.style.backgroundPosition = 'center';
        overlayPauseBtn.style.backgroundImage = 'url('+ pauseBase64Img +')';
        overlayPauseBtn.style.backgroundColor = 'transparent';
        overlayPauseBtn.style.backgroundSize = 'contain';
        overlay.appendChild(overlayPauseBtn);
        videoControlsWrapper.appendChild(overlay); // Appending overlay element into videoControlsWrapper to get rid of potential CSS matrix transform

        /**
         * Video controls listeners
         */
        // Video progress
        videoElement.addEventListener('timeupdate', function() {
            if (!progressBarContainer.getAttribute('max')) {
                progressBarContainer.setAttribute('max', videoElement.duration);
            }
            const currentTime = videoElement.currentTime;
            const duration = videoElement.duration | 0;
            progressBarContainer.value = currentTime;
            progressBar.style.width = Math.floor((currentTime / duration) * 100) + '%';
            updateDurationContainer(currentTime, duration);
            // Reached the end of the video
            if (currentTime === duration) {
                playPauseBtn.style.backgroundImage = 'url(' + playBase64Img + ')';
            }
        });

        // Play/Pause button
        playPauseBtn.addEventListener('click', function() {
            let img = '', display = '';
            if (videoElement.paused || videoElement.ended) {
                videoElement.play();
                img = pauseBase64Img;
                display = 'none';
            }
            else {
                updateVideoOverlayPosition();
                videoElement.pause();
                img = playBase64Img;
                display = 'block';
            }
            playPauseBtn.style.backgroundImage = 'url(' + img + ')';
            overlay.style.display = display;
        });

        // Click on video to pause
        videoElement.addEventListener('click', function() {
            let img = '';
            // Playing video if never launched yet
            if (videoElement.paused && videoElement.currentTime === 0) {
                videoElement.play();
                playPauseBtn.style.backgroundImage = 'url(' + pauseBase64Img + ')';
            }
            // Pausing video if already launched
            else if (!videoElement.paused && videoElement.currentTime > 0) {
                updateVideoOverlayPosition();
                videoElement.pause();
                playPauseBtn.style.backgroundImage = 'url(' + playBase64Img + ')';
                overlay.style.display = 'block';
            }
        });

        // Click on pause overlay to pause
        overlay.addEventListener('click', function() {
            if (videoElement.paused) {
                videoElement.play();
                playPauseBtn.style.backgroundImage = 'url(' + pauseBase64Img + ')';
                overlay.style.display = 'none';
            }
        });

        // Stop button
        stopBtn.addEventListener('click', function() {
            videoElement.pause();
            videoElement.currentTime = 0;
            progressBarContainer.value = 0;
            playPauseBtn.style.backgroundImage = 'url(' + playBase64Img + ')';
            overlay.style.display = 'none';
        });

        // Rewind button
        rewindBtn.addEventListener('click', function() {
            videoElement.currentTime -= 15;
        });

        // Forward button
        forwardBtn.addEventListener('click', function() {
            videoElement.currentTime += 15;
        });

        // Progress bar
        /*progressBarContainer.addEventListener('click', function(e) {
            const pos = (e.pageX  - this.offsetLeft) / this.offsetWidth;
            videoElement.currentTime = pos * videoElement.duration;
        });*/

        // Fullscreen button
        fullscreenBtn.addEventListener('click', function() {
            if (!isFullscreen) {
                enterFullscreen();
            }
            else {
                exitFullscreen();
            }
            updateVideoOverlayPosition();
        });

        /**
         * Dealing with fullscreen mode
         */
        function enterFullscreen() {
            // Styling global video wrapper
            videoWrapper.style.position = 'fixed';
            videoWrapper.style.top = 0;
            videoWrapper.style.left = 0;
            videoWrapper.style.width = '100%';
            videoWrapper.style.height = '100%';
            videoWrapper.style.backgroundColor = '#000';
            // Styling video element
            videoElement.style.width = '100%';
            videoElement.style.height = 'cal(100% - 32px)';

            /* Putting some black stripes */
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            const videoWidth = videoElement.clientWidth;
            const videoHeight = videoElement.clientHeight;
            const isVideoHorizontal = videoWidth / videoHeight > 1;
            const isVideoVertical = videoWidth / videoHeight < 1;

            // Horizontal video
            if (isVideoHorizontal) {
                videoWrapper.style.paddingTop = ((windowHeight - (videoHeight + 32)) / 2) + 'px';
            }
            // Vertical video
            else if (isVideoVertical) {
                videoWrapper.style.paddingLeft = ((windowWidth - videoWidth) / 2) + 'px';
            }
            // Square video
            else {
                videoWrapper.style.paddingTop = ((windowHeight - (videoHeight + 32)) / 2) + 'px';
                videoWrapper.style.paddingLeft = ((windowWidth - videoWidth) / 2) + 'px';
            }

            isFullscreen = true;
            fullscreenBtn.style.backgroundImage = 'url(' + exitFullscreenBase64Img + ')';
        }

        function exitFullscreen() {
            videoWrapper.style.position = videoWrapperStyle.position;
            videoWrapper.style.top = videoWrapperStyle.top;
            videoWrapper.style.left = videoWrapperStyle.left;
            videoWrapper.style.padding = videoWrapperStyle.padding;
            videoWrapper.style.width = videoWrapperStyle.width;
            videoWrapper.style.height = videoWrapperStyle.height;
            videoWrapper.style.backgroundColor = 'transparent';
            isFullscreen = false;
            fullscreenBtn.style.backgroundImage = 'url(' + enterFullscreenBase64Img + ')';
        }

        /**
         * Dealing with common action wrapper properties
         */
        function getCommonActionWrapperProperties(element, optionsToOverride) {
            element.style.position = 'relative';
            element.style.float = 'left';
            element.style.width = '32px';
            element.style.height = '32px';
            element.style.display = 'inline-block';
            element.style.overflow = 'hidden';
            if (optionsToOverride) {
                for (let prop in optionsToOverride) {
                    element.style[prop] = optionsToOverride[prop];
                }
            }
        }

        /**
         * Dealing with common button properties
         */
        function getCommonVideoBtnProperties(element, optionsToOverride) {
            // element.style.float = 'left';
            element.style.margin = '6px';
            element.style.width = '20px';
            element.style.height = '20px';
            element.style.border = 'solid 2px transparent';
            element.style.borderBox = '';
            element.style.backgroundColor = 'transparent';
            element.style.backgroundRepeat = 'no-repeat';
            element.style.backgroundPosition = 'center';
            element.style.backgroundSize = 'contain';
            element.style.display = 'block';
            element.style.cursor = 'pointer';
            element.style.outline = 'none';
            if (optionsToOverride) {
                for (let prop in optionsToOverride) {
                    element.style[prop] = optionsToOverride[prop];
                }
            }
        }

        /**
         * Dealing with video overlay properties
         */
        function updateVideoOverlayPosition() {
            overlay.style.width = videoElement.clientWidth + 'px';
            overlay.style.height = videoElement.clientHeight + 'px';
        }

        /**
         * Dealing with callback function
         */
        if (callback) {
            callback();
        }

        let cssRules = '#videoControls > li.button:hover { background-color: #299ffd; }';
        cssRules += '#overlay:hover #overlayPauseBtn { background-image: url(' + playBase64Img + ') !important; }';
        updateCssRules(cssRules);

    }

    /**
     * Dealing with duration format
     */
    function getOptimalDurationFormat(seconds) {
        const hours = Math.floor(seconds / (60 * 60));
        seconds -= hours * (60 * 60);
        const minutes = Math.floor(seconds / 60);
        seconds -= minutes * 60;
        return hours + ':' + ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2);
    }

    /**
     * Updating duration container value
     */
    function updateDurationContainer(currentTime, duration) {
        document.getElementById('videoDuration').innerText = getOptimalDurationFormat(currentTime.toFixed(0)) + ' / ' + getOptimalDurationFormat(duration.toFixed(0));
    }

    /**
     * Updating CSS rules
     */
    function updateCssRules(cssRules) {
        var style = document.createElement('style');
        if (style.styleSheet) {
            style.styleSheet.cssText = cssRules;
        } else {
            style.appendChild(document.createTextNode(cssRules));
        }
        document.getElementsByTagName('head')[0].appendChild(style);
    }

    return {
        init: init
    }

};
