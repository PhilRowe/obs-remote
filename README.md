# OBS Remote

A web interface which allows you to change scenes in OBS.

![OBS-Remote](https://user-images.githubusercontent.com/8597859/94350506-dcf9c800-0046-11eb-917f-addedece8618.png)

### Features:
- No installation needed, works in any modern browser, works best on a tablet :-)
- Support for remote control through [WSS tunnels](https://github.com/Palakis/obs-websocket/blob/4.x-current/SSL-TUNNELLING.md)
- Easily switch scenes
- Pin your favourite scenes for quick access
- Support for Studio Mode (preview and program scenes)
- Preview of output, updating continuously
- Persistent settings using Localstorage
- Hide scenes after a certain point (see settings)

### Requirements:

- [OBS](https://obsproject.com/)
- [OBS-websocket](https://github.com/Palakis/obs-websocket/releases) plugin

### Hosted version
If you want to try out the hosted version [https://obs-remote.vercel.app/](https://obs-remote.vercel.app/) which is hosted with https you will need to expose your local OBS via a tunnel service so that its available over https [see these instructions](https://github.com/Palakis/obs-websocket/blob/4.x-current/SSL-TUNNELLING.md)

---

#### Build instructions:

```bash
npm i
npm run dev
