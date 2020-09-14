export function processScenes (scenes, hideAfter) {
    var found = true;

    scenes = scenes.filter(scene => {
        if (found && scene.name.includes(hideAfter)) {
            found = false;
        }

        return found;
    });

    return scenes;
}