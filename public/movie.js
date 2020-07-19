src = "https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js";
const apikey = '48a2033158ad063caeb9d44786f0190a';
//TIM KIEM PHIM
async function evtSubmit(e) {
    e.preventDefault();

    const strSearch = $('form input').val();
    const reqStr1 = `https://api.themoviedb.org/3/search/movie?api_key=${apikey}&query=${strSearch}`;
    const reqStr2 = `https://api.themoviedb.org/3/search/person?api_key=${apikey}&query=${strSearch}`;
    loading();
    const response1 = await fetch(reqStr1);
    const response2 = await fetch(reqStr2);
    const rs1 = await response1.json();
    const rs2 = await response2.json();
    fillMovies(rs1.results); //tim theo ten phim
    fillPerson(rs2.results); // tim theo dien vien
}
//
async function LoadPage() {
    reqStr = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apikey}`;
    loading();
    const response = await fetch(reqStr);
    const rs = await response.json();
    fillMovies(rs.results); //tim theo ten phim
}
//TÌM THEO TÊN PHIM
function fillMovies(moviesSearch) {
    $('#main').empty();
    for (const m of moviesSearch) {
        $('#main').append(` 
    <div class="col-md-4 py-1">
    <div class="card shadow h-100" onclick="LoadDetail('${m.id}')">
            <img src="https://image.tmdb.org/t/p/w500${m.poster_path}" class="card-img-top" alt="${m.original_title}">
            <div class="card-body">
              <h5 class="card-title">${m.original_title}</h5>
              <p>Rate: ${m.vote_average} Imb</p>
              <p>Viewer: ${m.popularity} people</p>
              <p>Realease date: ${m.release_date} </p>
            </div>
          </div>
    </div>`);
    }
}
//TÌM THEO TÊN DIỄN VIÊN
function fillPerson(personSearch) {
    for (const ps of personSearch) {
        for (var i = 0; i < ps.known_for.length; i++) {
            $('#main').append(` 
<div class="col-md-4 py-1">
<div class="card shadow h-100" onclick="LoadDetail('${ps.known_for[i].id}')">
        <img src="https://image.tmdb.org/t/p/w500${ps.known_for[i].poster_path}" class="card-img-top" alt="${ps.known_for[i].original_title}">
        <div class="card-body">
          <h5 class="card-title">${ps.known_for[i].original_title}</h5>
          <p>Rate: ${ps.known_for[i].vote_average} Imb</p>
          <p>Realease date: ${ps.known_for[i].release_date} </p>
        </div>
      </div>
</div>`);
        }
    }
}
//CHI TIET PHIM
async function LoadDetail(id) {

    const reqStr1 = `https://api.themoviedb.org/3/movie/${id}?api_key=${apikey}&append_to_response=credits`;
    const reqstr2 = `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${apikey}`;
    loading();

    const response1 = await fetch(reqStr1);
    const response2 = await fetch(reqstr2);
    const movie = await response1.json();
    const movieReview = await response2.json();

    fillMovie(movie);
    LoadGenres(movie.genres);
    LoadActor(movie.credits.cast);
    LoadReview(movieReview.results);
}
function fillMovie(m) {
    $('#main').empty();
    $('#main').append(`
<!-- Page Content -->
<div class="container">

<!-- Portfolio Item Heading -->
<h1 class="my-4">${m.original_title}
  <small>(${m.release_date})</small>
</h1>

<!-- Portfolio Item Row -->
<div class="row">

  <div class="col-md-5">
    <img class="img-fluid" src="https://image.tmdb.org/t/p/w500${m.poster_path}" >
  </div>

  <div class="col-md-7">
    <h3 class="my-3">OVERVIEW</h3>
    <p>${m.overview}</p>
    <p>Run Time: ${m.runtime}minutes</p>
    <p class="genres">Genres: </p>
    <p class="actor">Actors: </p>
    
  </div>
  <h3 class="my-3">REVIEW</h3>
  <p class="review"> </p>

</div>
</div>
<!-- /.container -->`);

}
//CHI TIET DIEN VIEN
async function LoadDetailPeople(idp) {

    const reqStr = `https://api.themoviedb.org/3/person/${idp}?api_key=${apikey}&append_to_response=movie_credits`;
    loading();

    const response = await fetch(reqStr);
    const people = await response.json();

    fillPeople(people);
    LoadMovieCast(people.movie_credits.cast);
}
function fillPeople(p) {
    $('#main').empty();
    $('#main').append(`
<!-- Page Content -->
<div class="container">

<!-- Portfolio Item Heading -->
<h1 class="my-4">${p.name}
</h1>

<!-- Portfolio Item Row -->
<div class="row">

<div class="col-md-5">
  <img class="img-fluid" src="https://image.tmdb.org/t/p/w500${p.profile_path}" >
</div>

<div class="col-md-7">
  <h3 class="my-3">BIOGRAPHY</h3>
  <p>${p.biography}</p>
  <p>Birthday: ${p.birthday}</p>
  <p>Home town: ${p.place_of_birth}</p>
  <p>Deathday: ${p.deathday}</p>
  <p class ="moviecast">Movies Cast:  </p>
</div>

</div>
</div>
<!-- /.container -->`);
}


function LoadActor(actor) {
    for (var i = 0; i < actor.length; i++) {
        $('.actor').append(`<button onclick="LoadDetailPeople('${actor[i].id}')">${actor[i].name}</button> `);
    }
}
//hien thi review
function LoadReview(review) {
    for (var i = 0; i < review.length; i++) {
        $('.review').append(`${review[i].author} : ${review[i].content} \n`);
    }
}
function LoadGenres(genres) {
    for (var i = 0; i < genres.length; i++) {
        $('.genres').append(` ${genres[i].name}, `);
    }
}
//LOAD DANH SÁCH PHIM CỦA DIỄN VIÊN
function LoadMovieCast(mvc) {

    for (var i = 0; i < mvc.length; i++) {
        $('.moviecast').append(` ${mvc[i].title},  `);
    }
}

//LOADING   
function loading() {
    $('#main').empty();
    $('#main').append(`
<div class="d-flex justify-content-center">
<div class="spinner-border" role="status">
  <span class="sr-only">Loading...</span>
</div>
</div>`);
}

