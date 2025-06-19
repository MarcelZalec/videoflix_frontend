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