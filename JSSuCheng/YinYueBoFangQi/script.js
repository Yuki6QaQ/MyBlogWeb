const audio = document.getElementById('audio');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressContainer = document.getElementById('progress-container');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const titleEl = document.getElementById('song-title');
const artistEl = document.getElementById('artist-name');
const albumEl = document.getElementById('album-name');
const sourceEl = document.getElementById('source-name');
const coverImg = document.getElementById('cover-img');
const disc = document.querySelector('.record');
const lyricsWrapper = document.getElementById('lyrics-wrapper');
const songInfo = document.querySelector('.song-info');
const lyricsContainer = document.querySelector('.lyrics-container');
const volumeIcon = document.getElementById('volume-icon');
const verticalVolumeContainer = document.getElementById('vertical-volume-container');
const verticalVolumeBar = document.getElementById('vertical-volume-bar');
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');

const songs = [
    {
        title: 'Let Go',
        artist: 'Beau Young Prince',
        album: 'Spider-Man: Into the Spider-Verse',
        source: '搜索',
        src: './audio/1.mp3',
        cover: './image/1.jpg',
        lyricsContent: `[00:00.00] 作词 : Beau Young/Jaimy Lageweg
[00:01.00] 作曲 : Beau Young/Jaimy Lageweg
[00:18.25]Sometimes I don't really know myself
[00:20.95]Devil on my back, pray for me, need help
[00:23.15]Angel in the front tryna guide my steps
[00:25.54]Who do you call when you need some help?
[00:27.91]Who do you call when you by yourself?
[00:30.32]Who do you call when you feel down low?
[00:32.69]I just wanna scream, I just wanna explode
[00:35.18]I, I just wanna let go
[00:37.68]I just wanna let go, (I, yeah)
[00:42.36]I just wanna let go (I, yeah)
[00:47.30]I just wanna let go (I, yeah yeah)
[00:52.02]I just wanna let go (I, I just wanna let go)
[00:56.49]Yeah, yeah, yeah
[00:56.98]Got a devil on my left and an angel on my right
[00:59.53]I'm just tryna live my life
[01:00.68]I'm just hangin' in the fight (Yuh)
[01:02.25]Swingin' off the web of life,
[01:03.26]Glidin' through the breeze (Breeze)
[01:04.79]My uncle always told me that it never would be easy (Nah)
[01:07.02]Now I'm lookin' to the sky hoping that he rest in peace
[01:09.16]Violence in the streets, I just wanna calm the beast
[01:11.68]All these problems
[01:12.35]I'm just fightin' with myself and enemies
[01:13.96]Looking for my peace while I'm
[01:15.65](Looking for my peace while I'm)
[01:16.89]I just wanna swing and fly away (Fly away)
[01:18.82]I just wanna see a better day (Better day)
[01:21.13]I just wanna soar and never drown (Never drown)
[01:23.64]I'm looking for my happiness now (Now)
[01:26.05]I just wanna swing and fly away (Fly away)
[01:28.34]I just wanna see a better day (A better day)
[01:30.87]I just wanna soar and never drown (Drown)
[01:33.28]I'm looking for my happiness now, yeah
[01:35.68]Sometimes I don't really know myself
[01:37.95]Devil on my back, pray for me, need help
[01:39.95]Angel in the front tryna guide my steps (My steps)
[01:42.70]Who do you call when you need some help? (Some help)
[01:45.13]Who do you call when you by yourself? (Yourself)
[01:47.12]Who do you call when you feel down low? (Down low)
[01:49.48]I just wanna scream, I just wanna explode (Explode)
[01:52.24]I, I just wanna let go (Let go)
[01:54.82]I just wanna let go (I, yeah)
[01:58.95]I just wanna let go (I, yeah)
[02:04.02]I just wanna let go (I, I just wanna let go)
[02:09.05]I just wanna let go (I, I just wanna let go)
[02:14.10]

`
    },
    {
        title: 'Scared 2 Be Lonely',
        artist: 'Lil Tjay',
        album: '222',
        source: '搜索',
        src: './audio/2.mp3',
        cover: './image/2.jpg',
        lyricsContent: `[00:00.000] 制作人 : VVS Melody/Way9/GeoVocals/FAS Beats
[00:00.138] 作词 : Lil Tjay/Florian Thi Nguyen Van/Fedor Sommerfeld/Daniel Way/Georgia Boyden
[00:00.276] 作曲 : Florian Thi Nguyen Van/Fedor Sommerfeld/Daniel Way/Georgia Boyden/Andre Robertson
[00:00.415] Too many lonely days, too many solo nights
[00:03.842] I'll be back in your arms at midnight
[00:08.569] Hold me 'cause I'm scared to be lonely
[00:15.518]
[00:15.711] Strapped up, but I know how to fight
[00:17.387] Trauma kid, but future lookin' bright
[00:19.226] Money long, just stackin' different height
[00:21.059] Ain't gon' let 'em take me out tonight
[00:22.900] In the stu', I'm workin' 'cause I'm paid
[00:24.848] Tryna flex these millions I made
[00:26.651] Phone ringin', niggas wanna talk
[00:28.419] I ain't pick that shit up in some days
[00:30.335]
[00:30.485] Dead broke nigga, come from rags
[00:32.222] Sorry if me shinin' gets you mad
[00:34.049] Niggas got no motion, shit be sad
[00:35.763] So they say I'm cocky when I brag
[00:37.669] I was low, low, down bad
[00:39.631] Went to school, no money, 'bout to crash
[00:41.421] Turnin' this shit to somethin' was a task
[00:43.222] Now you look at me, you see the glass
[00:45.048] Foreign V's, hoppin' out the whip
[00:46.979] 'Member me and Lola hoppin' cabs (Damn)
[00:48.748] Sittin', smokin', thinkin' 'bout my life (Sit)
[00:50.554] Why the good go so fast? (Damn)
[00:52.553] Why would God save my type? (Huh?)
[00:54.464] He know all my secrets from the past (Damn)
[00:56.182] Thinkin' 'bout the shit I been through (Damn)
[00:58.131] I ain't probably come out so bad (Oh)
[00:59.864]
[01:00.012] Strapped up, but I know how to fight
[01:01.647] Trauma kid, but future lookin' bright
[01:03.498] Money long, just stackin' different height
[01:05.300] Ain't gon' let 'em take me out tonight
[01:07.163] In the stu', I'm workin' 'cause I'm paid
[01:08.931] Tryna flex these millions I made
[01:10.828] Phone ringin', niggas wanna talk
[01:12.662] I ain't pick that shit up in some days
[01:14.112]
[01:14.285] So many times I could've died (Hey, died, died)
[01:18.483] I don't be prayin', no lie, but I won't deny
[01:21.950] Something saved me, something saved me
[01:25.631] God, oh, why?
[01:29.405]
[01:29.571] Grind mode, that be always (Hey)
[01:31.309] I'm just tryna give myself a raise
[01:33.076] Life hard, I be makin' plays (Huh?)
[01:34.938] Like I'm tryna figure out a maze
[01:36.776] From the heart whenever I write
[01:38.608] Trauma on my mental won't fade
[01:40.407] Shot seven times, no glaze (Shot)
[01:42.326] We done put some niggas in the—
[01:44.035] I could show a nigga how to act
[01:45.969] .40 cal', it teach him to behave
[01:47.831] I come from a city if you lack
[01:49.627] You must watch your shit up on the page
[01:51.531] Lotta shit can't say up in these raps (No)
[01:53.352] Know I'm different, I just got my ways
[01:55.243] Shit be on my mental, so I blaze (Boom)
[01:57.072] Free my niggas sittin' in the cage (Boom, boom)
[01:58.822]
[01:58.973] Strapped up, but I know how to fight
[02:00.750] Trauma kid, but future lookin' bright (Grrah, grrah)
[02:02.613] Money long, just stackin' different height
[02:04.427] Ain't gon' let 'em take me out tonight (No)
[02:06.326] In the stu', I'm workin' 'cause I'm paid
[02:08.175] Tryna flex these millions I made
[02:09.979] Phone ringin', niggas wanna talk
[02:11.914] I ain't pick that shit up in some days
[02:13.071]
[02:13.230] So many times I could've died
[02:17.795] I don't be prayin', no lie, but I won't deny
[02:21.265] Something saved me, something saved me
[02:24.819] God, oh, why?

`
    },
    {
        title: 'The Way I Still Love You',
        artist: 'Reynard Silva',
        album: 'Reynard Silva',
        source: '搜索',
        src: './audio/3.mp3',
        cover: './image/3.jpg',
        lyricsContent: `[00:00.000] 作词 : Reynard Silva
[00:01.000] 作曲 : kolja
[00:22.430]Not a single day goes by
[00:25.050]Show me what is through my mind
[00:27.580]I know it's over but I can‘t deny
[00:30.020]I'm still missing you (I'm still missing you)
[00:33.000]And I'm torn cause I'm hella frustrated
[00:35.950]I know we have something special baby
[00:38.370]But now the fact is you gone for good
[00:40.920]And I don't know what to do
[00:43.600]I try to stay occupied
[00:46.210]I try to put it all aside
[00:48.950]I try and try and try and try
[00:52.040]Still it's no use
[00:54.540]Don't know what's going on with me
[00:57.150]But all I know it's haunting me
[00:59.770]I need your love to set me free
[01:02.719]Listen to me
[01:06.180]Do you still think about me baby,baby
[01:11.849]Cause you’re on my mind and it’s driving me crazy, crazy
[01:17.220]Are you finally over me
[01:19.650]You can tell me the truth
[01:22.670]Or do you still love me
[01:24.819]The way that I still love you
[01:28.730]Just the other day I've seen you
[01:31.349]We caught up for a little while
[01:33.750]You told me you were doing just fine
[01:35.739]Well it was good to see you smile
[01:39.550]Memories running through my head
[01:42.140]Feelings coming back, oh yeah
[01:45.450]Yeah it hurts again
[01:47.349]You're happy with someone else
[01:50.050]I try to stay  occupied
[01:52.450]I try to put it all aside
[01:55.220]I try and try and try and try
[01:58.310]Still it's no use
[02:00.750]Don't know what's going on with me
[02:03.469]But all I know it's haunting me
[02:06.239]I need your love to set me free
[02:09.150]Listen to me oh baby
[02:12.789]Do you still think about me baby,baby
[02:17.849]Cause you on my mind is driving me crazy, crazy
[02:23.569]Are you finally over me
[02:25.720]You can tell me the truth
[02:28.830]Or do you still love me
[02:30.939]The way that I still love you
[02:34.330]Oh I know
[02:36.680]That I let love slip away
[02:42.000]And I'm going insane all because I want you back
[02:47.560]I need you back
[02:49.919]This is the biggest regret
[02:52.449]I'll ever have to face oh yeah
[02:56.410]Do you still think about me baby ,baby(do you still love me?)
[03:02.460]Cause you on my mind is driving me crazy, crazy
[03:07.819]Are you finally over me
[03:09.849]You can tell me the truth
[03:13.030]Or do you still love me
[03:15.509]The way that I still love you (the way that I still love you)?

`
    }
];

let songIndex = 0;
let currentLyrics = [];
let isPlaying = false;
let lastVolume = 0.7;

audio.volume = lastVolume;
updateVolumeUI(lastVolume);

loadSong(songs[songIndex], false);
// 初始化显示上海天气
updateWeatherDisplay('Shanghai', 22, '晴朗', '01d');

function loadSong(song, animate = true) {
    if (animate) {
        startTransition(() => {
            updateSongDetails(song);
        });
    } else {
        updateSongDetails(song);
    }
}

function updateSongDetails(song) {
    titleEl.innerText = song.title;
    artistEl.innerText = song.artist;
    albumEl.innerText = song.album;
    sourceEl.innerText = song.source;
    audio.src = song.src;

    coverImg.style.opacity = 0;
    setTimeout(() => {
        coverImg.src = song.cover;
        coverImg.style.opacity = 1;
    }, 500);

    if (song.lyricsContent) {
        parseLyrics(song.lyricsContent);
    } else {
        currentLyrics = [];
    }
    renderLyrics();
}

function parseLyrics(lrcString) {
    const lines = lrcString.split('\n');
    const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;

    currentLyrics = lines.map(line => {
        const match = line.match(timeRegex);
        if (match) {
            const minutes = parseInt(match[1], 10);
            const seconds = parseInt(match[2], 10);
            const milliseconds = parseInt(match[3], 10);
            const time = minutes * 60 + seconds + milliseconds / 1000;
            const text = line.replace(timeRegex, '').trim();
            return { time, text };
        }
        return null;
    }).filter(item => item !== null && item.text !== '');

    currentLyrics.sort((a, b) => a.time - b.time);
}

function renderLyrics() {
    lyricsWrapper.innerHTML = '';

    if (currentLyrics.length === 0) {
        lyricsWrapper.innerHTML = '<p class="lyric-placeholder">纯音乐，请欣赏</p>';
        return;
    }

    currentLyrics.forEach((line, index) => {
        const p = document.createElement('p');
        p.classList.add('lyric-line');
        p.innerText = line.text;
        p.dataset.index = index;
        lyricsWrapper.appendChild(p);
    });
}

function startTransition(callback) {
    songInfo.classList.add('fade-out');
    lyricsContainer.classList.add('fade-out');
    disc.classList.remove('rotate');

    setTimeout(() => {
        callback();

        setTimeout(() => {
            songInfo.classList.remove('fade-out');
            lyricsContainer.classList.remove('fade-out');
            if (isPlaying) {
                disc.classList.add('rotate');
            }
        }, 50);
    }, 500);
}

function playSong() {
    isPlaying = true;
    disc.classList.add('rotate');
    playBtn.querySelector('i').classList.remove('fa-play');
    playBtn.querySelector('i').classList.add('fa-pause');
    audio.play();
}

function pauseSong() {
    isPlaying = false;
    disc.classList.remove('rotate');
    playBtn.querySelector('i').classList.add('fa-play');
    playBtn.querySelector('i').classList.remove('fa-pause');
    audio.pause();
}

playBtn.addEventListener('click', () => {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});

prevBtn.addEventListener('click', () => {
    songIndex--;
    if (songIndex < 0) {
        songIndex = songs.length - 1;
    }
    loadSong(songs[songIndex]);
    if (isPlaying) {
        setTimeout(playSong, 500);
    }
});

nextBtn.addEventListener('click', () => {
    songIndex++;
    if (songIndex > songs.length - 1) {
        songIndex = 0;
    }
    loadSong(songs[songIndex]);
    if (isPlaying) {
        setTimeout(playSong, 500);
    }
});

function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    if (isNaN(duration)) return;

    const progressPercent = (currentTime / duration) * 100;
    progressBar.style.width = `${progressPercent}%`;

    currentTimeEl.innerText = formatTime(currentTime);
    durationEl.innerText = formatTime(duration);

    syncLyrics(currentTime);
}

function syncLyrics(currentTime) {
    if (currentLyrics.length === 0) return;

    let activeIndex = currentLyrics.findIndex((line, index) => {
        const nextLine = currentLyrics[index + 1];
        return currentTime >= line.time && (nextLine ? currentTime < nextLine.time : true);
    });

    if (activeIndex === -1) activeIndex = 0;

    const lines = document.querySelectorAll('.lyric-line');

    lines.forEach(line => line.classList.remove('active'));

    const activeLine = lines[activeIndex];
    if (activeLine) {
        activeLine.classList.add('active');
        activeLine.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    let sec = Math.floor(seconds % 60);
    if (sec < 10) {
        sec = `0${sec}`;
    }
    return `${min}:${sec}`;
}

audio.addEventListener('timeupdate', updateProgress);

function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;

    audio.currentTime = (clickX / width) * duration;
}

progressContainer.addEventListener('click', setProgress);

audio.addEventListener('ended', () => {
    nextBtn.click();
});

function updateVolumeUI(volume) {
    verticalVolumeBar.style.height = `${volume * 100}%`;
    if (volume === 0) {
        volumeIcon.className = 'fas fa-volume-mute';
    } else if (volume < 0.5) {
        volumeIcon.className = 'fas fa-volume-down';
    } else {
        volumeIcon.className = 'fas fa-volume-up';
    }
}

volumeIcon.addEventListener('click', () => {
    if (audio.volume > 0) {
        lastVolume = audio.volume;
        audio.volume = 0;
        updateVolumeUI(0);
    } else {
        audio.volume = lastVolume;
        updateVolumeUI(lastVolume);
    }
});

verticalVolumeContainer.addEventListener('click', (e) => {
    e.stopPropagation();
    const rect = verticalVolumeContainer.getBoundingClientRect();
    const clickY = rect.bottom - e.clientY;
    const height = rect.height - 20;
    let volume = clickY / height;
    if (volume < 0) volume = 0;
    if (volume > 1) volume = 1;
    audio.volume = volume;
    lastVolume = volume;
    updateVolumeUI(volume);
});

let isDraggingVolume = false;

verticalVolumeContainer.addEventListener('mousedown', (e) => {
    isDraggingVolume = true;
    const rect = verticalVolumeContainer.getBoundingClientRect();
    const clickY = rect.bottom - e.clientY;
    const height = rect.height - 20;
    let volume = clickY / height;
    if (volume < 0) volume = 0;
    if (volume > 1) volume = 1;
    audio.volume = volume;
    lastVolume = volume;
    updateVolumeUI(volume);
});

document.addEventListener('mousemove', (e) => {
    if (!isDraggingVolume) return;
    const rect = verticalVolumeContainer.getBoundingClientRect();
    if (e.clientY >= rect.top - 20 && e.clientY <= rect.bottom + 20) {
        const clickY = rect.bottom - e.clientY;
        const height = rect.height - 20;
        let volume = clickY / height;
        if (volume < 0) volume = 0;
        if (volume > 1) volume = 1;
        audio.volume = volume;
        lastVolume = volume;
        updateVolumeUI(volume);
    }
});

document.addEventListener('mouseup', () => {
    isDraggingVolume = false;
});

// --- 天气功能 (使用模拟数据，确保稳定运行) ---
function updateWeatherDisplay(city, temp, desc, iconCode) {
    document.getElementById('w-temp').innerText = `${temp}°C`;
    document.getElementById('w-desc').innerText = desc;

    const iconEl = document.getElementById('w-icon');
    iconEl.className = '';

    // 根据天气描述或图标代码设置 FontAwesome 图标
    if (desc.includes('晴') || iconCode.includes('01')) iconEl.classList.add('fas', 'fa-sun');
    else if (desc.includes('云') || iconCode.includes('02') || iconCode.includes('03') || iconCode.includes('04')) iconEl.classList.add('fas', 'fa-cloud');
    else if (desc.includes('雨') || iconCode.includes('09') || iconCode.includes('10')) iconEl.classList.add('fas', 'fa-cloud-rain');
    else if (desc.includes('雷') || iconCode.includes('11')) iconEl.classList.add('fas', 'fa-bolt');
    else if (desc.includes('雪') || iconCode.includes('13')) iconEl.classList.add('fas', 'fa-snowflake');
    else iconEl.classList.add('fas', 'fa-cloud-sun');
}

function getMockWeather(city) {
    // 模拟数据生成逻辑，参考你的 TianQi 项目
    const mockTemp = Math.floor(Math.random() * 30) + 5; // 5-35度
    const weathers = ["晴朗", "多云", "阴天", "小雨", "大雨", "雷阵雨"];
    const mockWeather = weathers[Math.floor(Math.random() * weathers.length)];

    // 简单的图标映射
    let iconCode = '01d';
    if (mockWeather.includes('云')) iconCode = '02d';
    if (mockWeather.includes('阴')) iconCode = '03d';
    if (mockWeather.includes('雨')) iconCode = '10d';

    updateWeatherDisplay(city, mockTemp, mockWeather, iconCode);
}

// 搜索按钮事件
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getMockWeather(city);
        cityInput.value = ''; // 清空输入框
    } else {
        alert("请输入城市名称");
    }
});

// 回车键事件
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            getMockWeather(city);
            cityInput.value = '';
        }
    }
});