/**
 * Returns control bar configuration options based on the screen width.
 * 
 * On small screens (<700px), certain controls are disabled for a cleaner UI.
 * On larger screens, inline volume control and skip buttons are enabled.
 *
 * @returns {object} - Control bar configuration object suitable for initializing a video player.
 */
export function setUpControles() {
    const controlBarOptions = window.innerWidth < 700
        ? {
            playToggle: false,
            fullscreenToggle: false,
            volumePanel: false,
            pictureInPictureToggle: false,
          }
        : {
            fullscreenToggle: false,
            volumePanel: { inline: true },
            pictureInPictureToggle: false,
            skipButtons: {
              forward: 10, // 10 Sekunden vorwärts
              backward: 10 // 10 Sekunden zurück
            },
          };
    return controlBarOptions;
}