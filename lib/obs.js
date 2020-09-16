export async function sendCommand(obs, command, params) {
    try {
        return await obs.send(command, params || {});
    } catch (e) {
        console.log('Error sending command', command, params,' - error is:', e);
        return {};
    }
}

export async function toggleStudioMode(obs) {
    await sendCommand(obs, 'ToggleStudioMode');
}

export async function setScene(obs, name) {
    await sendCommand(obs, 'SetCurrentScene', { 'scene-name': name });
}

export async function transitionScene(obs, name) {
    await sendCommand(obs, 'TransitionToProgram');
}

export async function setPreview(obs, name) {
    await sendCommand(obs, 'SetPreviewScene', { 'scene-name': name });
}

export async function startStream(obs) {
    await sendCommand(obs, 'StartStreaming');
}

export async function stopStream(obs) {
    await sendCommand(obs, 'StopStreaming');
}