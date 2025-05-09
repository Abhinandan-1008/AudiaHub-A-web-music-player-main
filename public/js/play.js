let previous = document.querySelector('#pre'),
    play = document.querySelector('#play'),
    next = document.querySelector('#next'),
    title = document.querySelector('#title'),
    recent_volume = document.querySelector('#volume'),
    volume_icon = document.querySelector('#volume_icon'),
    volume_show = document.querySelector('#volume_show'),
    slider = document.querySelector('#duration_slider'),
    full_duration = document.querySelector('#full_duration'),
    passed_duration = document.querySelector('#passed_duration'),
    track_image = document.querySelector('#track_image'),
    present = document.querySelector('#present'),
    total = document.querySelector('#total'),
    artist = document.querySelector('#artist'),
    main = document.querySelector('#main'),
    list = document.querySelector('#list'),
    repeat = document.querySelector('#repeat'),
    shuffle = document.querySelector('#shuffle'),
    genreSearch = document.querySelector('#genre');


let timer, link, All_song, max, gen, index_no;

var ogImageMeta = document.querySelector('meta[property="og:image"]');
var ogTwtImgMeta = document.querySelector('meta[name="twitter:card"]');



const id = new URLSearchParams(window.location.search).get('id');

const renderDetails = async () => {
    if (id) {
        const res = await fetch(`https://tarana.onrender.com/songs/` + id);
        if (!res.ok) {
            console.log("No able to fetch songs");
        } else {
            const song = await res.json();
            index_no = parseInt(song.id) - 1;
            GetAllSongs(index_no);

            // window.history.pushState("Tarana", "Tarana", "https://flyingsonu122.github.io/tarana/index.html");
            window.history.pushState("Tarana", "Tarana", "https://flyingsonu122.github.io/tarana");
        }
    } else {
        // console.log("No id provided");
        index_no = 0;
        GetAllSongs(index_no);
    }
}



window.addEventListener('DOMContentLoaded', renderDetails());


function shareplay() {
    const copyLink = document.getElementById('copyLink');
    copyLink.onclick = () => {
        var songlink = `https://flyingsonu122.github.io/tarana/?id=${index_no + 1}`;
        navigator.clipboard.writeText(songlink)
            .then(() => {
                alert("Song link copied to clipboard " + songlink);
            })
            .catch((error) => {
                console.error('Error copying link to song: ', error);
            });
    }
    const fbshare = document.getElementById('fbshare');
    fbshare.href = `https://facebook.com/sharer/sharer.php?u=https://flyingsonu122.github.io/tarana/?id=${index_no + 1}`
    const twshare = document.getElementById('twshare');
    twshare.href = `https://twitter.com/intent/tweet?text=https://flyingsonu122.github.io/tarana/?id=${index_no + 1}`
    const whshare = document.getElementById('whshare');
    whshare.href = `https://api.whatsapp.com/send/?text=https://flyingsonu122.github.io/tarana/?id=${index_no + 1}`


}



// creating an audio Element.
let track = document.createElement('audio');

function GetAllSongs(index_no) {
    shareplay();


    fetch("https://tarana.onrender.com/songs")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            All_song = data;

            max = All_song.length;

            track.src = All_song[index_no].path;
            title.innerHTML = All_song[index_no].name;
            track_image.src = All_song[index_no].img;
            ogImageMeta.setAttribute('content', All_song[index_no].img);
            ogTwtImgMeta.setAttribute('content', All_song[index_no].img);
            artist.innerHTML = All_song[index_no].singer;

            track.load();
            track.volume = recent_volume.value / 100;

            timer = setInterval(range_slider, 1000);
            total.innerHTML = All_song.length;
            present.innerHTML = index_no + 1;

            All_song.forEach(element => {
                genLink(element);

            });

            genreSearch.addEventListener('input', function () {
                list.innerHTML = '';
                gen = this.value;
                var genreSong = All_song.filter(g => g.genre === gen);
                // console.log(genreSong);
                genreSong.forEach(e => {
                    genLink(e);
                });
            });
        });
}

function genLink(e) {

    link = document.createElement('a');
    // link.innerHTML = `${e.name} &rarr;${e.singer}`;
    link.innerHTML = `<span style="color: yellow; ">${e.name}</span>  <i> ${e.singer} </i>`;
    link.title = `click to play`;

    link.addEventListener('click', function () {
        index_no = e.id - 1;
        track.src = All_song[e.id - 1].path;
        title.innerHTML = All_song[e.id - 1].name;
        track_image.src = e.img;
        artist.innerHTML = e.singer;
        present.innerHTML = All_song[e.id - 1].id;

        nochange();
        reset_slider();
        playsong();
    });

    list.append(link);

}



// change slider position 
function change_duration() {
    slider_position = track.duration * (slider.value / 100);
    track.currentTime = slider_position;
}



function changeDur() {
    slider_position = track.duration * (slider.value / 100);
    track.currentTime = slider_position;
    curmins = Math.floor(track.currentTime / 60), cursecs = Math.floor(track.currentTime - curmins * 60);

    if (cursecs < 10) {
        passed_duration.innerHTML = `${curmins} : 0${cursecs}`;
    } else {
        passed_duration.innerHTML = `${curmins} : ${cursecs}`;
    }

}



var first_click = true;
pausesong();

play.onclick = function () {
    if (first_click) {
        playsong();
        first_click = false;
    } else {
        pausesong();
        first_click = true;
    }
}

var first = true;
volume_icon.onclick = function () {
    if (first) {
        mute_sound();
        first = false;
        volume_icon.classList.add('fa-volume-off');
        volume_icon.classList.remove('fa-volume-up');
        volume_icon.title = "Unmute";

    } else {
        reset_sound();
        first = true;
        volume_icon.classList.remove('fa-volume-off');
        volume_icon.classList.add('fa-volume-up');
        volume_icon.title = "Mute";

    }
}

// sound functions
var curVolume, curVolVal;

function mute_sound() {
    curVolVal = recent_volume.value;
    curVolume = recent_volume.value / 100;
    track.volume = 0;
    volume.value = 0;
    volume_show.innerHTML = 0;

}

function reset_sound() {
    track.volume = curVolume;
    volume.value = curVolVal;
    volume_show.innerHTML = curVolVal;
}

// change volume
function volume_change() {
    volume_icon.title = "Mute";
    // playsong();
    // first_click = false;
    if (volume_icon.classList.contains('fa-volume-off')) {
        first = true;
        volume_icon.classList.add('fa-volume-up');
    }

    volume_show.innerHTML = recent_volume.value;
    track.volume = recent_volume.value / 100;
    if (track.volume == 0) {
        first = false;
        volume_icon.title = "Unmute";
        volume_icon.classList.add('fa-volume-off');
        volume_icon.classList.remove('fa-volume-up');
    } else {
        first = true;
        volume_icon.title = "Mute";
        volume_icon.classList.remove('fa-volume-off');
        volume_icon.classList.add('fa-volume-up');
    }

}


recent_volume.oninput = function () {
    volume_show.innerHTML = this.value;
    track.volume = this.value / 100;
}

// reset song slider
function reset_slider() {
    slider.value = 0;
}

// play song
function playsong() {
    shareplay();
    track.play();
    first_click = false;
    play.innerHTML = '<i class="fa fa-pause" aria-hidden="true"></i>';
    play.title = "Pause";
}

// pause song
function pausesong() {

    track.pause();
    first_click = true;
    play.innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>';
    play.title = "Play";
}

// next song
function next_song() {
    if (index_no < All_song.length - 1) {
        index_no += 1;
        out();
    } else {
        index_no = 0;
        out();

    }

}

// previous song

function previous_song() {
    if (index_no > 0) {
        index_no -= 1;
        out();

    } else {
        index_no = All_song.length - 1;
        out();
    }
}


var curmins, cursecs;



// for repeat
var select = true;
repeat.innerHTML = ``;

// for shuffle
var selected = true;

function range_slider() {
    let position = 0;
    // update slider position
    if (!isNaN(track.duration)) {

        position = track.currentTime * (100 / track.duration);
        slider.value = position;

        curmins = Math.floor(track.currentTime / 60), cursecs = Math.floor(track.currentTime - curmins * 60);
        if (cursecs < 10) {
            passed_duration.innerHTML = `${curmins} : 0${cursecs}`;
        } else {
            passed_duration.innerHTML = `${curmins} : ${cursecs}`;
        }

        var durmins = Math.floor(track.duration / 60),
            dursecs = Math.floor(track.duration - durmins * 60);
        if (dursecs < 10) {
            full_duration.innerHTML = `${durmins} : 0${dursecs}`;
        } else {
            full_duration.innerHTML = `${durmins} : ${dursecs}`;
        }
    }

    repeat.onclick = function () {
        if (select) {
            repeat.innerHTML = `1`;
            repeat.classList.add('selected');
            repeat.classList.remove('repeat');
            repeat.title = "Disable repeat";
            if (track.ended) {
                out();

            }

            select = false;

        } else {
            repeat.innerHTML = ``;
            repeat.classList.add('repeat');
            repeat.classList.remove('selected');
            select = true;
            repeat.title = "Enable repeat";
        }
    }


    shuffle.onclick = function () {

        if (selected) {

            shuffle.classList.add('selected');
            shuffle.classList.remove('shuffle');
            // console.log(shuffle.className);
            selected = false;
            shuffle.title = "Disable shuffle";

            if (track.ended) {

            } else {
                var anotherRandom = Math.floor(Math.random() * max);
                // console.log(anotherRandom);
                index_no = anotherRandom;
                // console.log(index_no);
                out();
            }

        } else {
            shuffle.classList.remove('selected');
            shuffle.classList.add('shuffle');
            selected = true;
            shuffle.title = "Enable shuffle";
        }
    }


    // function will run when the song is over
    if (track.ended) {
        if (shuffle.classList.contains("selected") && repeat.innerHTML == '') {
            var random = Math.floor(Math.random() * max);
            index_no = random;
            out();
        } else if (repeat.innerHTML == '') {
            next_song();
        } else {
            if (track.ended) {
                out();
            }
        }
    }
}

function out() {
    track.src = All_song[index_no].path;
    title.innerHTML = All_song[index_no].name;
    track_image.src = All_song[index_no].img;
    ogImageMeta.setAttribute('content', All_song[index_no].img);
    ogTwtImgMeta.setAttribute('content', All_song[index_no].img);
    artist.innerHTML = All_song[index_no].singer;

    track.load();

    timer = setInterval(range_slider, 1000);
    total.innerHTML = All_song.length;
    present.innerHTML = index_no + 1;
    playsong();
}

// Function to open and close documentation.
const hide_show = document.getElementById('hide_show'),
    main_body_hide = document.getElementById('main_body_hide');

var click = true;
nochange();

hide_show.onclick = function () {
    if (click) {
        change();
        click = false;
    } else {
        nochange();
        click = true;
    }
}

function change() {
    main_body_hide.style.display = '';
    main.style.display = 'none';
    hide_show.innerText = 'X';
    // hide_show.style.color = "#fff";
}

function nochange() {
    main_body_hide.style.display = 'none';
    main.style.display = '';
    hide_show.innerText = '☰';
    // hide_show.style.color = "#fff";
}

//  dark mode

var body = document.getElementById("body");
var m = document.getElementById("main");
var themebtn = document.getElementById("themebutton");
var fc = true;

n_ch();
themebtn.onclick = function () {
    if (fc) {
        ch();
        fc = false;
    } else {
        n_ch();
        fc = true;
    }
}

function ch() {
    themebtn.style.color = "black";
    themebtn.style.backgroundColor = "white";
    body.style.backgroundColor = "black";
    body.style.color = "white";
    m.style.backgroundColor = "#414A4C";
    hide_show.style.color = "white";
    themebtn.className = "fa fa-sun-o";
}

function n_ch() {
    themebtn.style.color = "white";
    themebtn.style.backgroundColor = "black";
    body.style.backgroundColor = "white";
    body.style.color = "black";
    m.style.backgroundColor = "#FFFAFA";
    hide_show.style.color = "black";
    themebtn.className = "fa fa-moon-o";
}
