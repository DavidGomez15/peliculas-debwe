import React, { useEffect, useState } from 'react'
import axios from 'axios'
import YouTube from 'react-youtube';
import './App.css';

function App() {
  const API_URL = 'https://api.themoviedb.org/3'
  const API_KEY = '0961063d89c3c46c375ac6a156a915d8'
  const IMAGE_PATH = 'https://image.tmdb.org/t/p/original'
  const URL_IMAGE = 'https://image.tmdb.org/t/p/original'

  //variables de estado
  const [movies, setMovies] = useState([])
  const [searchKey, setSearchKey] = useState("")
  const [trailer, setTrailer] = useState(null);
  const [movie, setMovie] = useState({title: "Loading Movies"});
  const [playing, setPlaying] = useState(false);

  //función para realizar la petición por get a la API
  const fetchMovies = async(searchKey) => {
    const type = searchKey ? "search" : "discover"
    const {data: {results},} = await axios.get(`${API_URL}/${type}/movie`,{
      params: {
        api_key: API_KEY,
        query: searchKey,
      },
    });
    setMovies(results)
    setMovie(results[0])

    if(results.length){
      await fetchMovie(results[0].id)
    }
  }

  //funcion para la peticion de un solo objeto y mostrar en reporductor de video
  const fetchMovie = async (id) => {
    const {data} = await axios.get(`${API_URL}/movie/${id}`,{
      params: {
        api_key: API_KEY,
        append_to_response: "videos"
      }
    })
    if (data.videos && data.videos.results){
      const trailer = data.videos.results.find(
        (vid) => vid.name === "Oficial Trailer"
      );
      setTrailer(trailer ? trailer : data.videos.results[0])
    }
    setMovie(data)
  } 
  
  //Funcion para seleccionar y abrir en el banner
  const selectMovie = async(movie) =>{
    fetchMovie(movie.id)
    setMovie(movie)
    window.scrollTo(0,0)
  }

  //Funcion para buscar peliculas
  const searchMovies = (e) => {
    e.preventDefault();
    fetchMovies(searchKey);
  }

  useEffect(()=>{
    fetchMovies();
  },[]) //[]renderizamos solamente la primera vez.

  return (
    <div>
      <h2 className='text-center mt-5 mb-5'>Trailer Movies</h2>
      {/* Buscador */}
      <form className='container mb-4' onSubmit={searchMovies}>
        <input type='text' placeholder='search' onChange={(e) => setSearchKey(e.target.value)}></input>
        <button className='btn btn-primary'>Search</button>
      </form>
      {/* Aqui va todo el contenedor del banner y el contenedor de video */}
      <div>
        <main>
          {movie ? (
            <div
              className="viewtrailer"
              style={{
                backgroundImage: `url("${IMAGE_PATH}${movie.backdrop_path}")`,
              }}
            >
              {playing ? (
                <>
                  <YouTube
                    videoId={trailer.key}
                    className="reproductor container"
                    containerClassName={"youtube-container amru"}
                    opts={{
                      width: "100%",
                      height: "100%",
                      playerVars: {
                        autoplay: 1,
                        controls: 0,
                        cc_load_policy: 0,
                        fs: 0,
                        iv_load_policy: 0,
                        modestbranding: 0,
                        rel: 0,
                        showinfo: 0,
                      },
                    }}
                  />
                  <button onClick={() => setPlaying(false)} className="boton">
                    Close
                  </button>
                </>
              ) : (
                <div className="container">
                  <div className="">
                    {trailer ? (
                      <button
                        className="boton"
                        onClick={() => setPlaying(true)}
                        type="button"
                      >
                        Play Trailer
                      </button>
                    ) : (
                      "Sorry, no trailer available"
                    )}
                    <h1 className="text-white">{movie.title}</h1>
                    <p className="text-white">{movie.overview}</p>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </main>
      </div>
      {/* Contenedor que va a mostrar los poster de las peliculas actuales */}
      <div className='container mt-3'>
      <div className='row'>
        {movies.map((movie)=>(
          <div key={movie.id} className='col-md-4 mb-3' onClick={() => selectMovie(movie)}>
            <img src={`${URL_IMAGE + movie.poster_path}`} alt="" height={600} width="100%"></img>
            <h4 className='text-center'>{movie.title}</h4>
          </div>
        ))}

      </div>

      </div>
    </div>
  );
}

export default App;