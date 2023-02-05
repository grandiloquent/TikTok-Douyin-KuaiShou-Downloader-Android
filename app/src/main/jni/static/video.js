document.querySelectorAll('[bind]').forEach(element => {
    if (element.getAttribute('bind')) {
        window[element.getAttribute('bind')] = element;
    }
    [...element.attributes].filter(attr => attr.nodeName.startsWith('@')).forEach(attr => {
        if (!attr.value) return;
        element.addEventListener(attr.nodeName.slice(1), evt => {
            window[attr.value](evt);
        });
    });
})

video.src = new URL(window.location).searchParams.get("q") || 'https://vid-cf.xvideos-cdn.com/11e500089c35ed421a6787a69000ad250f1b15c1-1673759910/videos/mp4/3/c/e/xvideos.com_3ce888f2c1ba95b001cb0a617ea184b0-2.mp4';
let d = new URL(window.location).searchParams.get("d");
if(d){
    video.currentTime=durationToSeconds(d);
}
let timer, showing = true, progressRect = progress.getBoundingClientRect();

function resize() {
    const ratio = Math.max(video.videoWidth / window.innerWidth, video.videoHeight / window.innerHeight);
    const width = video.videoWidth / ratio;
    const height = video.videoHeight / ratio;
    video.style.width = (width + 'px');
    video.style.height = (height + 'px');
    video.style.top = (((window.innerHeight - height) >> 1) + 'px')
}
function formatDuration(ms) {
    if (isNaN(ms)) return '0:00';
    if (ms < 0) ms = -ms;
    const time = {
        hour: Math.floor(ms / 3600) % 24,
        minute: Math.floor(ms / 60) % 60,
        second: Math.floor(ms) % 60,
    };
    return Object.entries(time)
        .filter((val, index) => index || val[1])
        .map(val => (val[1] + '').padStart(2, '0'))
        .join(':');
}
function durationToSeconds(duration) {
    let result = 0;
    if (/(\\d{1,2}:){1,2}\\d{1,2}/.test(duration)) {
        const pieces = duration.split(':');
        for (let i = pieces.length - 1; i > -1; i--) {
            result += Math.pow(60, i) * parseInt(pieces[pieces.length - i - 1]);
        }
    }
    return result;
}
function updateProgress() {
    if (showing) {
        played.style.width = (video.currentTime / video.duration * 100) + '%';
        timeStart.textContent = formatDuration(video.currentTime);
    }
}
function onAbortHanlder() {
    console.log("abort", `video.videoWidth = ${video.videoWidth}`, `video.videoHeight = ${video.videoHeight}`);

}
function onCanplayHanlder() {
    console.log("canplay", `video.videoWidth = ${video.videoWidth}`, `video.videoHeight = ${video.videoHeight}`);

}
function onCanplaythroughHanlder() {
    console.log("canplaythrough", `video.videoWidth = ${video.videoWidth}`, `video.videoHeight = ${video.videoHeight}`);

}
function onDurationchangeHanlder() {
    console.log("durationchange", `video.videoWidth = ${video.videoWidth}`, `video.videoHeight = ${video.videoHeight}`);
    resize();
    timeEnd.textContent = formatDuration(video.duration);
}
function onEmptiedHanlder() {
    console.log("emptied", `video.videoWidth = ${video.videoWidth}`, `video.videoHeight = ${video.videoHeight}`);

}
function onEndedHanlder() {
    console.log("ended", `video.videoWidth = ${video.videoWidth}`, `video.videoHeight = ${video.videoHeight}`);

}
function onErrorHanlder() {
    console.log("error", `video.videoWidth = ${video.videoWidth}`, `video.videoHeight = ${video.videoHeight}`);

}
function onLoadeddataHanlder() {
    console.log("loadeddata", `video.videoWidth = ${video.videoWidth}`, `video.videoHeight = ${video.videoHeight}`);

}
function onLoadedmetadataHanlder() {
    console.log("loadedmetadata", `video.videoWidth = ${video.videoWidth}`, `video.videoHeight = ${video.videoHeight}`);

}
function onLoadstartHanlder() {
    console.log("loadstart", `video.videoWidth = ${video.videoWidth}`, `video.videoHeight = ${video.videoHeight}`);

}
function onPauseHanlder() {
    console.log("pause", `video.videoWidth = ${video.videoWidth}`, `video.videoHeight = ${video.videoHeight}`);
    play.querySelector('path').setAttribute('d', "M6,4l12,8L6,20V4z");
}
function onPlayHanlder() {
    console.log("play", `video.videoWidth = ${video.videoWidth}`, `video.videoHeight = ${video.videoHeight}`);
    // <path d="M9,19H7V5H9ZM17,5H15V19h2Z"></path>
    play.querySelector('path').setAttribute('d', "M9,19H7V5H9ZM17,5H15V19h2Z");
}
function onPlayingHanlder() {
    console.log("playing", `video.videoWidth = ${video.videoWidth}`, `video.videoHeight = ${video.videoHeight}`);

}
function onProgressHanlder() {


    if (video.buffered && video.buffered.length) {
        const ratio = video.buffered.end(0) / video.duration;
        loaded.style.width = ratio * 100 + '%';
    }
}
function onRatechangeHanlder() {
    console.log("ratechange", `video.videoWidth = ${video.videoWidth}`, `video.videoHeight = ${video.videoHeight}`);

}
function onResizeHanlder() {
    console.log("resize ", `video.videoWidth = ${video.videoWidth}`, `video.videoHeight = ${video.videoHeight}`);

}
function onSeekedHanlder() {
    console.log("seeked", `video.videoWidth = ${video.videoWidth}`, `video.videoHeight = ${video.videoHeight}`);

}
function onSeekingHanlder() {
    console.log("seeking", `video.videoWidth = ${video.videoWidth}`, `video.videoHeight = ${video.videoHeight}`);

}
function onStalledHanlder() {
    console.log("stalled", `video.videoWidth = ${video.videoWidth}`, `video.videoHeight = ${video.videoHeight}`);

}
function onSuspendHanlder() {
    console.log("suspend", `video.videoWidth = ${video.videoWidth}`, `video.videoHeight = ${video.videoHeight}`);

}
function onTimeupdateHanlder() {
    updateProgress();
}
function onVolumechangeHanlder() {
    console.log("volumechange", `video.videoWidth = ${video.videoWidth}`, `video.videoHeight = ${video.videoHeight}`);

}
function onWaitingHanlder() {
    console.log("waiting", `video.videoWidth = ${video.videoWidth}`, `video.videoHeight = ${video.videoHeight}`);

}

async function onPlay(evt) {
    evt.stopPropagation();
    if (video.paused) {
        await video.play();
    } else {
        await video.pause();
    }
    scheduleHidden();
}
function scheduleHidden() {
    if (timer) {
        clearTimeout(timer);
    }
    timer = setTimeout(() => {
        middleWrapper.style.display = 'none';
        bottomWrapper.style.display = 'none';
        showing = false;
    }, 5000);
}
document.body.addEventListener('click', evt => {
    showing = true;
    updateProgress();
    middleWrapper.style.display = 'block';
    bottomWrapper.style.display = 'block';
    scheduleHidden();
})

function onProgress(evt) {
    evt.stopPropagation();
    if (video.duration) {
        const proportion = evt.offsetX / progressRect.width;
        video.currentTime = proportion * video.duration;
    }
}